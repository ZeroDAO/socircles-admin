<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table v-bind="table">
				<!-- 头像 -->
				<template #column-avatar="{ scope }">
					<cl-avatar
						shape="square"
						size="medium"
						:src="'https://circles-ubi.s3.amazonaws.com/uploads/avatars/' + scope.row.avatar | default_avatar"
						:style="{ margin: 'auto' }"
					>
					</cl-avatar>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert v-model="form" v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script>
export default {
	data() {
		return {
			form: {
				relevance: 1
			},
			upsert: {
				props: {
					width: "800px"
				},
				items: [
					{
						prop: "id",
						label: "用户ID",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "填写用户ID"
							}
						}
					},
					{
						prop: "address",
						label: "用户地址",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写用户地址"
							}
						}
					}
				]
			},
			table: {
				props: {
					"default-sort": {
						prop: "createTime",
						order: "descending"
					}
				},
				columns: [
					{
						type: "selection",
						align: "center",
						width: "60"
					},
					{
						prop: "id",
						label: "ID",
						align: "center",
						"min-width": 30
					},
					{
						prop: "avatar",
						label: "头像",
						align: "center",
					},
					{
						prop: "rank",
						label: "权重",
						align: "center",
					},
					{
						prop: "username",
						label: "用户名",
						align: "center"
					},
					{
						prop: "createTime",
						label: "创建时间",
						align: "center",
						sortable: "custom",
					},
					{
						prop: "updateTime",
						label: "更新时间",
						align: "center",
						sortable: "custom",
					},
					{
						label: "操作",
						align: "center",
						type: "op"
					}
				]
			}
		};
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.circles.fame).done();

			app.refresh();
		}
	}
};
</script>
