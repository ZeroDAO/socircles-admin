<template>
	<div class="system-algo">
		<div v-show="!job.inAlgo" class="start white-bg">
			<p class="title">开始计算</p>
			<cl-form ref="form" inner></cl-form>
		</div>
		<div v-if="inCrawler" class="stop-crawler white-bg">
			<i class="el-icon-warning-outline"></i>
			<span>有进行中的采集任务，先停止任务后进行计算</span>
		</div>
		<div v-else-if="job.inAlgo" class="algo">
			<el-row :gutter="10">
				<el-col :sm="24" :md="6">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>系统信息</span>
						</div>
						<div class="item">
							<span>Nonce</span>
							<span>{{ job.sysInfo.nonce }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>种子算法</span>
							<span>{{ job.sysInfo.seed_algo }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>种子初始值</span>
							<span>{{ job.sysInfo.seed_score }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>阻尼系数</span>
							<span>{{ job.sysInfo.damping_factor }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>最小除数</span>
							<span>{{ job.sysInfo.min_divisor }}</span>
						</div>
					</el-card>
				</el-col>
				<el-col :sm="24" :md="8">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>任务</span>
							<div class="set-btn">
								<el-button
									icon="el-icon-refresh-right"
									circle
									@click="refresh()"
								></el-button>
								<el-button
									icon="el-icon-setting"
									circle
									@click="openSetEvery()"
								></el-button>
							</div>
						</div>
						<div class="item">
							<div>
								<el-tag v-if="job.sysInfo.status == 1" type="success"
									>计算中</el-tag
								>
								<el-tag v-else-if="job.sysInfo.status == 0" type="warning"
									>计算完成</el-tag
								>
								<el-tag v-else type="danger">失败</el-tag>
							</div>
							<el-button
								v-if="percentage.isDone"
								icon="el-icon-s-claim"
								type="warning"
								@click="finish()"
								>完成</el-button
							>
							<el-button
								v-else-if="job.algoInfo.status == 1"
								icon="el-icon-video-pause"
								@click="pause()"
								type="danger"
								>暂停</el-button
							>
							<div v-else>
								<el-button
									icon="el-icon-video-play"
									type="primary"
									@click="recover()"
									>恢复</el-button
								>
								<el-button icon="el-icon-video-play" type="danger" @click="regain()"
									>回退</el-button
								>
							</div>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<div>
								<span>总任务进度</span>
								<p>{{ job.algoInfo.curr_step + "/" + job.algoInfo.total_steps }}</p>
							</div>
							<el-progress type="circle" :percentage="percentage.step"></el-progress>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<div>
								<span>子任务进度</span>
								<p>
									{{
										job.algoInfo.curr_sub_step +
										"/" +
										job.algoInfo.total_sub_step
									}}
								</p>
							</div>
							<el-progress
								type="circle"
								:percentage="percentage.sub_step"
							></el-progress>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>Task ID</span>
							<span>{{ job.algoInfo.task_id }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>间隔时间</span>
							<span>{{ job.algoInfo.every / 1000 }} 秒</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>开始时间</span>
							<span>{{ job.algoInfo.createTime }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>最近运行</span>
							<span>{{ job.algoInfo.updateTime }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>下次执行</span>
							<span>{{ job.algoInfo.nextRunTime || "待定" }}</span>
						</div>
					</el-card>
				</el-col>
				<el-col :sm="24" :md="10">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>日志</span>
						</div>
						<cl-crud
							v-if="job.algoInfo.id"
							@load="onLoad"
							ref="crud"
							class="system-algo"
							v-loading="logs.loading"
							element-loading-text="loading"
						>
							<el-row>
								<cl-table v-bind="logs"> </cl-table>
							</el-row>
							<el-row type="flex">
								<cl-flex1></cl-flex1>
								<cl-pagination></cl-pagination>
							</el-row>
						</cl-crud>
						<p class="no-log" v-else>未找到任务日志</p>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
export default {
	name: "system-algo",

	data() {
		return {
			job: {
				inAlgo: true,
				sysInfo: {
					nonce: 12,
					seed_algo: "closeness",
					status: 1,
					seed_score: 1000,
					seed_count: 20,
					damping_factor: 0.8,
					min_divisor: 10
				},
				algoInfo: {
					task_id: null,
					status: 0,
					total_steps: 7,
					curr_step: 0,
					total_sub_step: 1,
					curr_sub_step: 0,
					every: 0,
					createTime: "",
					updateTime: "",
					nextRunTime: ""
				}
			},
			inCrawler: false,
			logs: {
				props: {
					"row-key": "id"
				},
				loading: false,
				list: [],
				params: {
					taskId: 4
				},
				pagination: {
					size: 15,
					page: 1,
					total: 0
				},
				columns: [
					{
						prop: "id",
						label: "ID",
						width: 60
					},
					{
						prop: "status",
						label: "状态",
						width: 100,
						dict: [
							{
								label: "成功",
								value: 1,
								type: "success"
							},
							{
								label: "失败",
								value: 0,
								type: "danger"
							}
						]
					},
					{
						prop: "createTime",
						label: "时间"
					},
					{
						prop: "detail",
						label: "详情"
					}
				]
			}
		};
	},

	mounted() {
		this.getCrawler();
	},

	computed: {
		perm() {
			return this.$service.circles.inAlgo.permission;
		},
		percentage() {
			let total_sub_step = this.job.algoInfo.total_sub_step;
			return {
				step: Math.floor(
					(this.job.algoInfo.curr_step / this.job.algoInfo.total_steps) * 100
				),
				sub_step:
					total_sub_step == 0
						? 0
						: Math.floor((this.job.algoInfo.curr_sub_step / total_sub_step) * 100),
				isDone:
					this.job.algoInfo.curr_sub_step == total_sub_step &&
					this.job.algoInfo.curr_step == this.job.algoInfo.total_steps &&
					total_sub_step != 0
			};
		}
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.task.log).done();
			app.refresh({ taskId: this.job.algoInfo.task_id });
		},
		pause() {
			this.$service.circles.algo
				.pause()
				.then(() => {
					this.refJob();
				})
				.catch((err) => {
					this.$message.error(err.message);
				});
		},
		recover() {
			this.$service.circles.algo
				.recover()
				.then(() => {
					this.refJob();
				})
				.catch((err) => {
					this.$message.error(err.message);
				});
		},
		regain() {
			this.$service.circles.algo
				.regain()
				.then(() => {
					this.refJob();
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		finish() {
			this.$service.circles.algo
				.finish()
				.then(() => {
					this.refJob();
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		async getCrawler() {
			this.$service.circles.crawler
				.info()
				.then((res) => {
					if (!res) return;
					console.log(res);
					this.inCrawler = res.status == 1;
					if (res.status == 1) return;
					this.refJob();
				})
				.catch((err) => {
					this.$message.error(err.message);
				});
		},
		refsForm() {
			this.$refs.form.create({
				op: {
					saveButtonText: "开始",
					buttons: ["save"]
				},
				items: [
					{
						label: "种子数量",
						prop: "seed_count",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "种子用户的数量"
							},
							props: {
								min: 1,
								max: 10000
							}
						},
						rules: {
							required: true,
							message: "数量不可为空"
						}
					},
					{
						label: "种子声誉",
						prop: "seed_score",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "种子用户初始化得分"
							},
							props: {
								min: 1
							}
						},
						rules: {
							required: true,
							message: "初始化声誉值不可为空"
						}
					},
					{
						label: "阻尼系数",
						prop: "damping_factor",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "用于声誉算法的阻尼系数"
							},
							props: {
								min: 0.1,
								max: 1
							}
						},
						rules: {
							required: true,
							message: "阻尼系数不可为空"
						}
					},
					{
						label: "最小除数",
						prop: "min_divisor",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "声誉算法的最小除数"
							},
							props: {
								min: 1
							}
						},
						rules: {
							required: true,
							message: "最小除数不可为空"
						}
					},
					{
						label: "种子算法",
						prop: "seed_algo",
						component: {
							name: "el-select",
							attrs: {
								placeholder: "种子选取算法"
							},
							options: [
								{
									label: "Betweenness Centrality",
									value: "betweenness"
								},
								{
									label: "PageRank",
									value: "pageRank"
								},
								{
									label: "ArticleRank",
									value: "articleRank"
								},
								{
									label: "Degree Centrality",
									value: "degree"
								},
								{
									label: "Harmonic Centrality",
									value: "harmonic"
								},
								{
									label: "Eigenvector Centrality",
									value: "eigenvector"
								},
								{
									label: "Closeness Centrality",
									value: "closeness"
								}
							]
						},
						rules: {
							required: true,
							message: "算法不可为空"
						}
					},
					{
						label: "间隔时间",
						prop: "every",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "调度任务的监测周期"
							},
							props: {
								min: 1
							}
						},
						rules: {
							required: true,
							message: "间隔时间不可为空"
						}
					}
				],
				on: {
					submit: (data, { close, done }) => {
						// 提交
						data.every *= 1000;
						this.$message.success("开始");
						this.$service.circles.algo
							.start(data)
							.then(() => {
								return this.refJob();
							})
							.catch((err) => {
								this.$message.error(err);
							});
						close();
					}
				}
			});
		},
		refJob() {
			this.logs.loading = true;
			this.$service.circles.algo
				.jobInfo()
				.then((res) => {
					console.log(res);

					if (res) {
						this.job.sysInfo = res.sysInfo;
						this.job.inAlgo = res.inAlgo;
						if (!res.inAlgo) {
							this.job.algoInfo = res.algoInfo;
							this.refsForm();
						} else {
							this.job.algoInfo = res.algoInfo;
						}
					}
					this.logs.loading = false;
				})
				.catch((err) => {
					this.$message.error(err.message);
					this.logs.loading = false;
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
						value: this.job.algoInfo.every ? this.job.algoInfo.every / 1000 : 300,
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
						if (!data || data.every != this.job.algoInfo.every / 1000) {
							this.$service.circles.algo
								.set_algo_every({ every: data.every * 1000 })
								.then(() => {
									this.refJob();
									this.$message.success("保存成功");
								})
								.catch((err) => {
									this.$message.error(err.message);
									done();
								});
						}
						close();
					}
				}
			});
		},
		refresh() {
			this.refJob();
			this.$refs["crud"].refresh({ taskId: this.job.algoInfo.task_id });
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

.white-bg {
	background: #fff !important;
}
.system-algo {
	overflow-y: scroll;
	font-size: 14px;
	.stop-crawler {
		text-align: center;
		padding: 50px;
		i {
			display: block;
			font-size: 3em;
			color: firebrick;
			margin-bottom: 20px;
		}
	}
	.start {
		.cl-form {
			max-width: 600px;
			margin: 10px auto;
			padding-bottom: 30px;
		}
		.title {
			padding: 20px;
			width: 100%;
			text-align: center;
		}
	}
	.algo {
		.item {
			display: flex;
			justify-content: space-between;
			span:first-child {
				font-weight: bold;
				color: #787878;
			}
		}
		.clearfix {
			span {
				font-weight: bold;
				font-size: 16px;
			}
		}
		.el-divider--horizontal {
			margin: 18px 0;
		}
		.el-table__body-wrapper,
		.el-table--scrollable-y {
			max-height: 600px !important;
		}
		button {
			span {
				font-size: 14px !important;
				font-weight: normal !important;
			}
		}
		.clearfix {
			display: flex;
			justify-content: space-between;
			align-content: center;
		}
		.no-log {
			margin: 5px auto;
			text-align: center;
			color: #868585;
		}
	}
}
</style>
