#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

PS1='[\u@\h \W]\$ '

export SUDO_ASKPASS=/bin/dpass
export _JAVA_AWT_WM_NONREPARENTING=1

source ~/.config/broot/launcher/bash/br
alias grep='grep --color=auto'
alias ls='ls -h --color'