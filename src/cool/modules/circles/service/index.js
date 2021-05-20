import Algo from "./algo";
import Crawler from "./crawler";
import Fame from "./fame";

export default {
	circles: {
		crawler: new Crawler(),
		algo: new Algo(),
		fame: new Fame()
	}
};
