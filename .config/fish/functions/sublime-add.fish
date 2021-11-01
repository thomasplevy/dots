
function sublime-add

	set -l dir $go_cmd_dir$argv[1]

	if not test -d $dir
		echo Directory "$argv[1]" does not exist.
		return 1
	end

	subl --add $dir

end

complete --command sublime-add --arguments '( ls -A $go_cmd_dir )'