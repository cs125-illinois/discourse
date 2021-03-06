import { alias, or } from "@ember/object/computed";
import { makeArray } from "discourse-common/lib/helpers";
import { on } from "discourse-common/utils/decorators";
import discourseComputed from "discourse-common/utils/decorators";
import SelectKitHeaderComponent from "select-kit/components/select-kit/select-kit-header";

export default SelectKitHeaderComponent.extend({
  attributeBindings: [
    "label:title",
    "label:aria-label",
    "names:data-name",
    "values:data-value"
  ],
  classNames: "multi-select-header",
  layoutName:
    "select-kit/templates/components/multi-select/multi-select-header",
  selectedNameComponent: alias("options.selectedNameComponent"),

  forceEscape: alias("options.forceEscape"),

  ariaLabel: or("computedContent.ariaLabel", "title", "names"),

  title: or("computedContent.title", "names"),

  @on("didRender")
  _positionFilter() {
    if (!this.shouldDisplayFilter) return;

    const $filter = $(this.element.querySelector(".filter"));
    $filter.width(0);

    const leftHeaderOffset = $(this.element).offset().left;
    const leftFilterOffset = $filter.offset().left;
    const offset = leftFilterOffset - leftHeaderOffset;
    const width = $(this.element).outerWidth(false);
    const availableSpace = width - offset;
    const $choices = $filter.parent(".choices");
    const parentRightPadding = parseInt($choices.css("padding-right"), 10);
    $filter.width(availableSpace - parentRightPadding * 4);
  },

  @discourseComputed("computedContent.selection.[]")
  names(selection) {
    return makeArray(selection)
      .map(s => s.name)
      .join(",");
  },

  @discourseComputed("computedContent.selection.[]")
  values(selection) {
    return makeArray(selection)
      .map(s => s.value)
      .join(",");
  }
});
