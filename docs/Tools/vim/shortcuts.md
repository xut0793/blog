# vim 快捷键

## Vscode Simple Vim Shortcuts

```
模式 mode: normal inster visual				
模式切换				
normal				
esc	      进入normal			
inster				
i	        光标前插入模式			
I	        行首插入模式			
a	        光标后插入模式			
A	        行尾插入模式			
o	        向下换行插入模式			
O	        向上换行插入模式			
c	        删除字符，并进入插入模式			
cc	      删除整行，并进入插入模式			
C	        删除光标至行尾，并进入插入模式	

Visual				
v	        可视模式			
V	        可视行模式			
s	        选择字符，并进入可视模式			
ss	      选择整行，并进入可视模式			
S	        选择光标至行尾，并进入可视模式			

Operator 操作符：d c y r s				
x	        删除光标字符			
d[range]	删除指定范围			
dd	      删除整行			
D	        删除光标至行尾			
c[range]	删除指定范围，并进入插入模式			
cc	      删除整行，并进入插入模式			
C	        删除光标至行尾，并进入插入模式			
y[range]	复制指定范围			
yy	      复制整行			
Y	        复制光标至行尾			
r[range]	剪切指定范围			
rr	      剪切整行			
R	        剪切光标至行尾			
s[range]	选择字符，并进入可视模式			
ss	      选择整行，并进入可视模式			
S	        选择光标至行尾，并进入可视模式			
p	        光标后粘贴，y/yy/Y/r/rr/R命令的内容			
P	        光标前粘贴，y/yy/Y/r/rr/R命令的内容			
u	        撤消上一次操作	
				
Motions 范围移动				
行内移动（列移动）				
h	      前移一个字符			
l	      后移一个字符			
b	      前移至单词开头begin			
w	      后移至下一个单词结尾word			
e	      后移至单词结尾（含光标所在单词）end			
B	      前移至字串开头Begin			
E	      后移至字串结尾End			
_	      移至行首			
$     	移至行尾

跨行移动（行移动）				
j	      下移一行			
k	      上移一行			
H	      屏幕头部header			
M	      屏幕中间middle			
L	      屏幕底部lower			
{	      上一块（空行分隔的块）			
}	      下一块（空行分隔的块）			
gg	    文件首行			
G	      文件未尾行			
ctrl+g :rownum	跨到rownum指定行			
				
滚屏				
ctrl+u	向上更新半屏			
ctrl+d	向下更新半屏			
ctrl+y	向上更新全屏			
ctrl+e	向下更新全屏			
zt	    将光标滚至屏幕顶部top			
zz	    将光标行滚至屏幕中间			
zb	    将光标行滚至屏幕底部bottom			
				
行内查找				
t[char]	行内顺向查找字符			
T[char]	行内逆向查找字符			
;	      逆向查找字符的下一个			
,	      顺向查找字符的上一个
```