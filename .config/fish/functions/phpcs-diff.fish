function phpcs-diff

	argparse 'e/errors' 'f/fix' 'b/branch=' -- $argv

	set phpcs_cmd check-cs
	if set --query _flag_errors
		set phpcs_cmd check-cs-errors
	end
	if set --query _flag_fix
		set phpcs_cmd fix-cs
	end


	set diff_branch dev
	if set --query _flag_branch
		set diff_branch $_flag_branch
	end

	composer run $phpcs_cmd -- (git diff --name-only --diff-filter=ACM $diff_branch)
	
end