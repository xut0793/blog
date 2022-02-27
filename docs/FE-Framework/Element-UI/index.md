# Element-UI

Element-Ul是国内饿了么前端团队推出的一款基于Vue.js 2.0 的桌面端UI框架，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库。

这里主要记录在使用其中组件过程中的一些问题总结。

- el-form 表单只有一个输入框时回去刷新页面

Element UI为了遵守W3C规范特意设置的，就是当Form中只有一个Input的时候，Form把这个事件当成了是提交表单的操作，所以页面会刷新。
解决方法：
凡是`<el-form>`里面只有一个Input，就在`<el-form>`上附加一个事件：@submit.native.prevent，这样可以阻止默认提交，可以解决这个问题。


- el-form 和 el-table 组合封装表格行内嵌表单项，逐行校验输入值。原理就是el-form-item 表单项prop定义多级对象属性的校验`<el-form-item prop="data.1."`
- el-form 主动触发表单校验
- el-table 中 el-radio 点击触发事件
- el-upload 上传组件`slot='file'`插槽，自定义上传文件显示列表
- el-dialog 内容惰性加载的问题，以及关闭销毁的原理
- element resetFields()重置表单不生效问题此方法用于将form表单的数据设置为初始值，而这个初始值是在form mounted生命周期被赋值上去的。所以，在 form mounted之前，如果给form表单赋值了，那么后面调用resetFields()都是无效的，因为form表单的初始值已经在 mounted 之前就被赋值了。解决：在赋值的时候可用this.$nextTick()，这样就不会改变form表单的初始值了