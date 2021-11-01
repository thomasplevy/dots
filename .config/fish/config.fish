# Colors 
set_color black 15171C
set_color brblack 555555

set_color red B24A56
set_color brred EC5F67

set_color green  92B477
set_color brgreen 89E986

set_color yellow  C6735A
set_color bryellow FEC254

set_color blue  7C8FA5
set_color brblue 5486C0

set_color magenta  A5789E
set_color brmagenta BF83C1

set_color cyan  80CDCB
set_color brcyan 58C2C1

set_color white  B3B8C3
set_color brwhite FFFFFF

set -u fish_color_autosuggestion white
set -u fish_color_command green --bold
set -u fish_color_comment red
set -u fish_color_cwd green
set -u fish_color_cwd_root red
set -u fish_color_end green
set -u fish_color_error red
set -u fish_color_escape blue
set -u fish_color_match blue
set -u fish_color_normal normal
set -u fish_color_operator cyan
set -u fish_color_param brwhite
set -u fish_color_quote green
set -u fish_color_redirection brblue
set -u fish_color_search_match bryellow --background=brblack
set -u fish_color_selection white --bold --background=brblack
set -u fish_color_status red
set -u fish_color_user brgreen
set -u fish_color_valid_path --underline
set -u fish_pager_color_description yellow
set -u fish_pager_color_prefix white --bold --underline
set -u fish_pager_color_progress brwhite --background=cyan

# devilbox.
set -x DEVILBOX_PATH ~/devilbox
set -x DEVILBOX_CONTAINERS "php mysql httpd mailhog"

# nvm.
set -x NVM_DIR ~/.nvm
nvm use default --silent

# GH CLI
set -x EDITOR vim

# Kitty Completion via https://sw.kovidgoyal.net/kitty/#id28
kitty + complete setup fish | source

# Quick Diff
alias mydiff="diff --side-by-side --color"

# Update
alias update="sudo apt update && sudo apt list --upgradeable"
alias upgrade="sudo apt upgrade -y && sudo apt autoremove -y"

# Kitty SSH
alias ssh="kitty +kitten ssh"


# Used by various commands for quickly getting to LifterLMS plugins.
set -x go_cmd_dir ~/srv/www/llms/htdocs/wp-content/plugins/