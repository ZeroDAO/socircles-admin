<template>
	<cl-crud ref="crud" class="system-cir">
		<el-row type="flex" v-loading="task.loading" element-loading-text="加载中" class="log-btn">
			<ul class="op-btn">
				<el-button
					v-if="!task || task.info.status == 0"
					@click="start()"
					type="primary"
					v-permission="perm.start"
				>
					<i class="el-icon-aim"></i>
					<span>开始</span>
				</el-button>

				<el-button v-else type="danger" @click="stop()" v-permission="perm.stop">
					<i class="el-icon-error"></i>
					<span>停止</span>
				</el-button>

				<el-button @click="openSetEvery()" v-permission="perm.collection">
					<i class="el-icon-s-tools"></i>
					<span>设置</span>
				</el-button>
			</ul>
			<ul>
				<el-button @click="handleCurrentChange(1)" v-permission="perm.collection">
					<i class="el-icon-refresh"></i>
					<span>刷新</span>
				</el-button>
			</ul>
		</el-row>

		<el-row>
			<el-table
				:data="logs.list"
				class="log-table"
				style="width: 100%"
				header-cell-class-name="log-table-head"
			>
				<el-table-column prop="id" label="ID" align="center" width="120"> </el-table-column>
				<el-table-column prop="count" align="center" label="处理数据"> </el-table-column>
				<el-table-column prop="userCount" align="center" label="新增用户">
				</el-table-column>
				<el-table-column prop="relCount" align="center" label="新增关系"> </el-table-column>
				<el-table-column prop="status" align="center" label="状态">
					<template slot-scope="scope">
						<el-tag
							:type="scope.row.status == 0 ? 'primary' : 'success'"
							disable-transitions
							>{{ scope.row.status == 0 ? "失败" : "成功" }}</el-tag
						>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="开始时间"> </el-table-column>
				<el-table-column prop="updateTime" label="完成时间"> </el-table-column>
			</el-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1></cl-flex1>
			<div class="block">
				<el-pagination
					layout="prev, pager, next"
					:total="logs.pagination.total"
					:current-page="logs.pagination.page"
					:page-size="logs.pagination.size"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</div>
		</el-row>
	</cl-crud>
</template>

<script>
export default {
	name: "system-task",

	data() {
		return {
			task: {
				loading: false,
				info: {
					id: null,
					every: null,
					status: 0
				}
			},
			logs: {
				props: {
					"row-key": "id"
				},
				pagination: {
					size: 15,
					page: 1,
					total: 0
				},
				list: []
			}
		};
	},

	mounted() {
		this.refreshLog();
	},

	computed: {
		perm() {
			return this.$service.circles.crawler.permission;
		}
	},

	methods: {
		async collection({}) {},
		// 开始任务
		start() {
			this.$service.circles.crawler
				.start({ id: this.task.info.id })
				.then(() => {
					return this.getTask(true);
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		// 停止任务
		stop() {
			this.$service.circles.crawler
				.stop()
				.then(() => {
					return this.getTask(true);
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},

		async openSetEvery() {
			this.$crud.openForm({
				title: "设置",
				width: "600px",
				items: [
					{
						prop: "every",
						label: "轮询间隔",
						value: this.task.info.every ? this.task.info.every / 1000 : 3,
						props: {
							"controls-position": "right"
						},
						component: {
							name: "el-input-number"
						}
					}
				],
				on: {
					submit: (data, { close, done }) => {
						if (!data || data.every != this.task.info.every) {
							this.$service.circles.crawler
								.collection({ every: data.every * 1000 })
								.then(() => {
									this.getTask(true);
									this.$message.success("保存成功");
								})
								.catch((err) => {
									this.$message.error(err);
									done();
								});
						}
						close();
					}
				}
			});
		},

		async getTask(ref = false) {
			if (this.task.loading) {
				return false;
			}

			if (this.task.info.id && !ref) {
				return this.task.info.id;
			}

			this.task.loading = true;
			let taskId = this.$service.circles.crawler
				.info()
				.then((res) => {
					if (res) {
						this.task.info = res;
					}
					return res.id;
				})
				.catch((err) => {
					this.$message.error(err);
					done();
				});
			this.task.loading = false;
			return taskId;
		},

		handleCurrentChange(page) {
			this.logs.pagination.page = page;
			this.refreshLog();
		},

		// 刷新日志
		refreshLog() {
			this.getTask().then((taskId) => {
				console.log(taskId);
				if (taskId) {
					let pagination = this.logs.pagination;
					pagination.id = this.task.info.id;
					this.$service.task.info
						.log(pagination)
						.then((res) => {
							if (res.list.length > 0) {
								res.list.map((e) => {
									if (/^[0-9]+,[0-9]+,[0-9]$/.test(e.detail)) {
										let countArr = e.detail.split(",");
										e.count = countArr[0];
										e.userCount = countArr[1];
										e.relCount = countArr[2];
									} else {
										e.count = e.userCount = e.relCount = 0;
									}
								});
								this.logs.pagination = res.pagination;
								this.logs.list = res.list;
							}
						})
						.catch((err) => {
							this.$message.error(err);
							done();
						});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.Ghost {
	opacity: 0.7;
}

.Drag {
	border: 1px dashed #000 !important;
	background: #fff !important;
}

.log-table-head {
	line-height: 46px;
	font-size: 16px;
	color: rgb(165, 46, 46);
}

.system-cir {
	.log-table {
		font-size: 10px;
	}
	.op-btn {
		margin-bottom: 5px;
	}
	.el-table__row {
		padding: 0;
	}
	td {
		padding: 5px;
	}
	.log-btn {
		justify-content: space-between;
	}
}
</style>
