<template>
	<div class="system-algo">
		<div v-if="inCrawler" class="stop-crawler white-bg">
			<i class="el-icon-warning-outline"></i>
			<span>有进行中的采集任务，先停止任务后进行计算</span>
		</div>
		<div v-else-if="!job.inAlgo" class="start white-bg">
			<p class="title">开始计算</p>
			<cl-form ref="form" inner></cl-form>
		</div>
		<div v-else class="algo">
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
				<el-col :sm="24" :md="6">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>任务</span>
							<el-button
								v-if="job.algoInfo.status == 1"
								icon="el-icon-video-pause"
								type="danger"
								>暂停</el-button
							>
							<el-button
								v-else
								icon="el-icon-video-play"
								type="primary"
								>开始</el-button
							>
						</div>
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
							<span>{{ job.algoInfo.startDate }}</span>
						</div>
						<el-divider></el-divider>
						<div class="item">
							<span>最近运行</span>
							<span>{{ job.algoInfo.endData }}</span>
						</div>
					</el-card>
				</el-col>
				<el-col :sm="24" :md="12">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>日志</span>
						</div>
						<cl-crud
							@load="onLoad"
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
					task_id: 4,
					status: 0,
					total_steps: 8,
					curr_step: 2,
					total_sub_step: 11,
					curr_sub_step: 8,
					every: 2000,
					startDate: "2021-05-03 13:21:01",
					endData: "2021-05-03 13:21:01"
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
		this.getCrawler()
	},

	computed: {
		perm() {
			return this.$service.circles.inAlgo.permission;
		},
		percentage() {
			return {
				step: Math.floor(
					(this.job.algoInfo.curr_step / this.job.algoInfo.total_steps) * 100
				),
				sub_step: Math.floor(
					(this.job.algoInfo.curr_sub_step / this.job.algoInfo.total_sub_step) * 100
				)
			};
		}
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.task.log).done();
			app.refresh({ taskId: this.job.algoInfo.task_id });
		},
		async getCrawler() {
			this.$service.circles.crawler
				.info()
				.then((res) => {
					if (res) {
						this.inCrawler = res.info.status == 1;
						if (res.info.status != 1) {
							this.refJob();
						}
					}
				})
				.catch((err) => {
					this.$message.error(err);
					done();
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
							}
						},
						rules: {
							required: true,
							min: 1,
							message: "数量需要大于1"
						}
					},
					{
						label: "种子声誉",
						prop: "seed_score",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "种子用户初始化得分"
							}
						},
						rules: {
							required: true,
							min: 1,
							message: "必须大于1"
						}
					},
					{
						label: "阻尼系数",
						prop: "damping_factor",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "用于声誉算法的阻尼系数"
							}
						},
						rules: {
							required: true,
							min: 0.1,
							max: 1,
							message: "介于0.1 ~ 1之间"
						}
					},
					{
						label: "最小除数",
						prop: "min_divisor",
						component: {
							name: "el-input-number",
							attrs: {
								placeholder: "声誉算法的最小除数"
							}
						},
						rules: {
							required: true,
							min: 1,
							message: "需要大于1"
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
									value: "pagerank"
								},
								{
									label: "ArticleRank",
									value: "articlerank"
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
							}
						},
						rules: {
							required: true,
							min: 1,
							message: "时间需要大于1"
						}
					}
				],
				on: {
					submit: (data, { close, done }) => {
						// 提交
						this.$message.success("开始");
						this.$service.crawler.algo
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
					if (res) {
						this.job = res;
					}
					this.logs.loading = false;
					if (!res.inAlgo) {
						this.refsForm();
					}
				})
				.catch((err) => {
					this.$message.error(err);
					this.logs.loading = false;
					done();
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

.white-bg {
	background: #fff !important;
}
.system-algo {
	overflow-y: scroll;
	font-size: 14px;
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
		.el-table {
			
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
			float: right;
			padding: 5px 10px;
		}
	}
}
</style>
