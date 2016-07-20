var utils = require('../Utils_clust');
var colors = require('../colors');

module.exports = function process_category_info(params){

  console.log('process_category_info...')

  var super_string = ': ';
  var tmp_super;

  params.show_categories = {};
  params.all_cats = {};
  params.cat_names = {};

  var predefine_colors = false;
  if (params.cat_colors === null){
    params.cat_colors = {};
    predefine_colors = false;
  } else {
    predefine_colors = true;
  }

  var num_colors = 0;
  _.each(['row','col'], function(inst_rc){

    params.show_categories[inst_rc] = false;

    params.all_cats[inst_rc] = [];
    var tmp_keys = _.keys(params.network_data[inst_rc+'_nodes'][0]);

    _.each( tmp_keys, function(d){
      if (d.indexOf('cat-') >= 0){
        params.show_categories[inst_rc] = true;
        params.all_cats[inst_rc].push(d);
      }
    });


    if (params.show_categories[inst_rc]){

      if (predefine_colors === false){
        params.cat_colors[inst_rc] = {};
      }
      params.cat_names[inst_rc] = {};

      _.each( params.all_cats[inst_rc], function(inst_cat){


        _.each(params.network_data[inst_rc+'_nodes'], function(inst_node){

          if (inst_node[inst_cat].indexOf(super_string) > 0){
            tmp_super = inst_node[inst_cat].split(super_string)[0];
            params.cat_names[inst_rc][inst_cat] = tmp_super;
          } else {
            params.cat_names[inst_rc][inst_cat] = inst_cat;
          }

        });

        var names_of_cat = _.uniq(
            utils.pluck(params.network_data[inst_rc+'_nodes'], inst_cat)
          ).sort();

        if (predefine_colors === false){

          params.cat_colors[inst_rc][inst_cat] = {};

          _.each(names_of_cat, function(cat_tmp, i){

            var inst_color = colors.get_random_color(i+num_colors);

            params.cat_colors[inst_rc][inst_cat][cat_tmp] = inst_color;

            // hack to get 'Not' categories to not be dark colored
            // also doing this for false
            if (cat_tmp.indexOf('Not ') >= 0 || cat_tmp.indexOf(': false') > 0){
              params.cat_colors[inst_rc][inst_cat][cat_tmp] = '#eee';
            }

            num_colors = num_colors + 1;
          });

        }

      });

    }

    if (params.sim_mat){
      params.cat_colors.row = params.cat_colors.col;
    }

  });

  return params;
};