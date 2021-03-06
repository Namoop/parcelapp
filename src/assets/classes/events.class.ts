export class Base {
	get onhover(): Function {
		return () => {
			this.defaultOnHover?.();
			this.userOnHover?.();
		};
	}
	set onhover(x) {
		this.userOnHover = x;
	}
	protected defaultOnHover() {}
	protected userOnHover: Function;

	get onclick(): Function {
		return () => {
			this.defaultOnClick?.();
			this.userOnClick?.();
		};
	}
	set onclick(x) {
		this.userOnClick = x;
	}
	protected defaultOnClick() {}
	protected userOnClick: Function;

	get onblur(): Function {
		return () => {
			this.defaultOnBlur?.();
			this.userOnBlur?.();
		};
	}
	set onblur(x) {
		this.userOnBlur = x;
	}
	protected defaultOnBlur() {}
	protected userOnBlur: Function;

	get onmousedown(): Function {
		return () => {
			this.defaultOnMouseDown?.();
			this.userOnMouseDown?.();
		};
	}
	set onmousedown(x) {
		this.userOnMouseDown = x;
	}
	protected defaultOnMouseDown() {}
	protected userOnMouseDown: Function;

	get onmouseup(): Function {
		return () => {
			this.defaultOnMouseUp?.();
			this.userOnMouseUp?.();
		};
	}
	set onmouseup(x) {
		this.userOnMouseUp = x;
	}
	protected defaultOnMouseUp() {}
	protected userOnMouseUp: Function;
}