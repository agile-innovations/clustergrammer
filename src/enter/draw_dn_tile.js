module.exports = function draw_dn_tile(params){

  var start_x = 0;
  var final_x = params.viz.x_scale.rangeBand() - params.viz.border_width/params.viz.zoom_switch_y;
  var start_y = params.viz.y_scale.rangeBand() - params.viz.border_width/params.viz.zoom_switch;
  var final_y = params.viz.y_scale.rangeBand() - params.viz.border_width/params.viz.zoom_switch;

  var output_string = 'M' + start_x + ', ' + start_y + ' ,   L' +
  final_x + ', ' + final_y + ',  L' + final_x + ',0 Z';

  return output_string;  
};