import genericAction from "@Actions/generic";
import { isEmpty } from "lodash";

const dataHandler = async ({ dispatch, url, params, withLoading = true }) => {
	const urlParams = new URLSearchParams(params).toString();

	const data = await dispatch(
		genericAction(
			"get",
			`${url}?${urlParams}`,
			undefined,
			undefined,
			undefined,
			undefined,
			withLoading
		)
	);

	if (isEmpty(data)) return [];
	return data;
};

export default dataHandler;
