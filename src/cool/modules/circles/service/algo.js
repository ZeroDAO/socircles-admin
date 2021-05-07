import { BaseService, Service, Permission } from "cl-admin";

@Service("circles/algo")
class Algo extends BaseService {
	@Permission("jobInfo")
	jobInfo() {
		return this.request({
			url: "/jobInfo"
		});
	}

	@Permission("start")
	start(data) {
		return this.request({
			url: "/start",
			method: "POST",
			data
		});
	}

	@Permission("pause")
	pause() {
		return this.request({
			url: "/pause",
			method: "POST"
		});
	}

	@Permission("regain")
	regain() {
		return this.request({
			url: "/regain",
			method: "POST"
		});
	}

	@Permission("set_algo_every")
	set_algo_every(data) {
		return this.request({
			url: "/set_algo_every",
			method: "POST",
			data
		});
	}

	@Permission("finish")
	finish() {
		return this.request({
			url: "/finish",
			method: "POST"
		});
	}
}

export default Algo;
