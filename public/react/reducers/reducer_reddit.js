import { REDDIT_SEARCH, VALIDATE_VIDEOS, urlSplitter, REGEX_OBJ } from '../actions/index';

let count = 0; 

function validateUrl (ele) {
	// make submit not work and border around input red until the url is a valid one
	if (REGEX_OBJ.regYouTubeCom.test(ele) || REGEX_OBJ.regYoutuBe.test(ele) ||
		REGEX_OBJ.VimeoCom.test(ele) || REGEX_OBJ.VimeoPlayer.test(ele) ||
		REGEX_OBJ.DaiLy.test(ele) || REGEX_OBJ.DailyMotionCom.test(ele) || REGEX_OBJ.Streamable.test(ele)) {
		return {
			validUrl: true,
			url: ele,
			dummyValue: Math.floor(Math.random() * Math.floor(1000))
		};
	} else {
		return {
			validUrl: false,
			url: ele,
			dummyValue: Math.floor(Math.random() * Math.floor(1000))
		};
	}
};
let urls = null;
export default function (state = [], action) {
	switch (action.type) {
	case REDDIT_SEARCH:	
		let children = action.payload.data.data.children;
		urls = null;
		if (children.length > 0) {
			urls = children.map((x) => {
				return validateUrl(x.data.url);
			});
			return [...state, urls];
		}
		return state;
		break;
	case VALIDATE_VIDEOS:
		urls = action.payload;
		let temp = null;
		if (urls.length > 0) {
			temp = urls.map((x) => {
				return validateUrl(x.url)
			});
			return temp;
		};
		return state;
		break;
	default:
		return state;
	}
}
