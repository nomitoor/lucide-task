import {
	EditorView,
	Decoration,
	ViewPlugin,
	WidgetType,
	MatchDecorator,
} from "@codemirror/view";

// Plugin
const placeholders = ViewPlugin.fromClass(
	class {
		placeholders;

		constructor(view) {
			this.placeholders = placeholderMatcher.createDeco(view);
		}

		update(update) {
			this.placeholders = placeholderMatcher.updateDeco(
				update,
				this.placeholders
			);
		}
	},
	{
		decorations: (v) => v.placeholders,
		provide: (plugin) =>
			EditorView.atomicRanges.of((view) => {
				return view.plugin(plugin)?.placeholders || Decoration.none;
			}),
	}
);

const placeholderMatcher = new MatchDecorator({
	regexp: /\{\{([^}]+)\}\}/g,
	decoration: (match) =>
		Decoration.replace({
			widget: new PlaceholderWidget(match[1]),
		}),
});

class PlaceholderWidget extends WidgetType {
	constructor(label) {
		super();
		this.label = label;
	}

	eq(other) {
		return other.label === this.label;
	}

	toDOM() {
		let container = document.createElement("span");
		let wrap = document.createElement("span");
		let timeVariableBox = document.createElement("div");

		container.className =
			"p-1 box-border whitespace-nowrap rounded border border-solid font-medium bg-gray-900 bg-opacity-10 text-gray-900 border-gray-300 divide-x divide-slate-950 > * + *";

		wrap.innerHTML = this.label;
		wrap.className =
			"relative p-1 box-border whitespace-nowrap font-medium text-gray-900 border-gray-300";

		timeVariableBox.className =
			"resize-none inline-block cursor-pointer opacity-40 hover:opacity-65";
		timeVariableBox.innerHTML = "[x]";
		timeVariableBox.setAttribute("contenteditable", true);
		timeVariableBox.addEventListener("keypress", (e) => {
			console.log(timeVariableBox.innerHTML);
			if (e.which === 13) e.preventDefault();
		});

		container.append(wrap, timeVariableBox);
		return container;
	}
}

export default placeholders;
