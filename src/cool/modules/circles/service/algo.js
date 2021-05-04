import { BaseService, Service, Permission } from "cl-admin";

@Service("circles/algo")
class Algo extends BaseService {
	@Permission("jobInfo")
	collection() {
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
}

export default Algo;
