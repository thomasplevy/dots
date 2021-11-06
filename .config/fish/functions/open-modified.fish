function open-modified
	
	argparse 'a/all' 'm/modified' 'n/new' 'u/unmerged' 'h/help' -- $argv

	if set --query _flag_help
		echo "usage: open-modified [-a, --all] [-m, --modified] [-n, --new] [-u, --unmerged] [-h, --help]"
		echo ""
		echo "Opens files identified by the 'git status' command."
		echo ""
		echo ""
		echo "OPTIONS"
		echo "  -a, --all"
		echo "    Open all files identified by git status."
		echo ""
		echo "  -m, --modified"
		echo "    Opens only modified files."
		echo ""
		echo "  -n, --new"
		echo "    Opens only new files."
		echo ""
		echo "  -u, --unmerged"
		echo "    Opens only unmerged files."
		echo ""
		echo "  -h, --help"
		echo "    Displays this help manual."

   		return 0
	end

	if test "$argv" != ""
		set file_list $argv
	end

	set git_cmd git status -s
	set awk_cmd awk '{print $2}'

	if set --query _flag_all
		set file_list ( $git_cmd | $awk_cmd ) 
	end

	if set --query _flag_new
		set grep_pattern "??"
	end
	if set --query _flag_unmerged
		set grep_pattern "UU"
	end
	if set --query _flag_modified
		set grep_pattern "M"
	end
	
	if test "$grep_pattern" != ""
		set file_list ( $git_cmd | grep "$grep_pattern" | $awk_cmd ) 
	end	

	if test "$file_list" = ""
		echo No modified files to open
	end

	if test "$file_list" != ""
		open $file_list
	end

end

complete --command open-modified --no-files --arguments '( git status -s | awk \'{print $2}\' )'
