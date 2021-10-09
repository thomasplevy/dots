package.path = package.path .. ";/home/thoams/.config/conky/?.lua"
require "colors";

config = {
    
    border_width = 0,
    border_inner_margin = 0,

    cpu_avg_samples = 2,
    draw_outline = false,
    draw_shades = false,
    use_xft = true,
    font = 'Anonymice Nerd Font:size=15',
    net_avg_samples = 2,
    no_buffers = true,
    extra_newline = false,
    stippled_borders = 0,
    update_interval = 1.0,

    own_window = true,
    own_window_class = 'Conky',
    own_window_type = 'dock',

    own_window_transparent = false,
    own_window_argb_visual = true,
    own_window_argb_value = 250,
    own_window_colour = '15171C',

    double_buffer = true, -- fix "flickering"
}

config = add_colors( config )
