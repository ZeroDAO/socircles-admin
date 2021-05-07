import { BaseService, Service, Permission } from "cl-admin";

@Service("circles/crawler")
class Crawler extends BaseService {
	@Permission("collection")
	collection(data) {
		return this.request({
			url: "/collection",
			method: "POST",
			data
		});
	}

	@Permission("info")
	info() {
		return this.request({
			url: "/getInfo",
			method: "POST"
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

	@Permission("stop")
	stop() {
		return this.request({
			url: "/stop",
			method: "POST"
		});
	}
}

export default Crawler;
