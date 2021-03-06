var make_filter_title = require('./make_filter_title');
var run_filter_slider = require('./run_filter_slider');
var get_filter_default_state = require('./get_filter_default_state');
var get_subset_views = require('./get_subset_views');

d3.slider = require('../d3.slider');

module.exports = function make_slider_filter(cgm, filter_type, div_filters){

  var params = cgm.params;

  var requested_view = {};

  var possible_filters = _.keys(params.viz.possible_filters);

  _.each(possible_filters, function(tmp_filter){
    if (tmp_filter != filter_type){
      var default_state = get_filter_default_state(params.viz.filter_data, tmp_filter);
      requested_view[tmp_filter] = default_state;
    }
  });

  var filter_title = make_filter_title(params, filter_type);

  div_filters
    .append('div')
    .classed('title_'+filter_type,true)
    .classed('sidebar_text', true)
    .classed('slider_description', true)
    .style('margin-top', '5px')
    .style('margin-bottom', '3px')
    .text(filter_title.text + filter_title.state + filter_title.suffix);

  div_filters
    .append('div')
    .classed('slider_'+filter_type,true)
    .classed('slider',true)
    .attr('current_state', filter_title.state);

  var views = params.network_data.views;

  var available_views = get_subset_views(params, views, requested_view);

  // sort available views by filter_type value
  available_views = available_views.sort(function(a, b) {
      return b[filter_type] - a[filter_type];
  });

  var inst_max = available_views.length - 1;

  // $( params.root+' .slider_'+filter_type ).slider({
  //   value:0,
  //   min: 0,
  //   max: inst_max,
  //   step: 1,
  //   stop: function() {
  //     run_filter_slider(cgm, filter_type, available_views);
  //   }
  // });

  // Filter Slider
  //////////////////////////////////////////////////////////////////////
  var slide_filter_fun = d3.slider()
                           // .snap(true)
                           .value(0)
                           .min(0)
                           .max(inst_max)
                           .step(1)
                           .on('slide', function(evt, value){
                              run_filter_slider_db(cgm, filter_type, available_views, value);
                           })
                           .on('slideend', function(evt, value){
                              run_filter_slider_db(cgm, filter_type, available_views, value);
                           });


  // save slider function in order to reset value later
  cgm.slider_functions[filter_type] = slide_filter_fun;


  d3.select(cgm.params.root+' .slider_'+filter_type)
    .call(slide_filter_fun);

  //////////////////////////////////////////////////////////////////////

  var run_filter_slider_db = _.debounce(run_filter_slider, 1500);

};
