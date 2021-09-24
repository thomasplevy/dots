function open-modified
	
	argparse 'A/all' 'U/unmerged' 'M/modified' 'N/new' -- $argv

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
