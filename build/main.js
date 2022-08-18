"use strict";
//constants
// interfaces
// interface list_item_info {
//     is_list_item: boolean;
//     position: number;
//     tag: string;
//     father: ParentNode;
//     list: ChildNode[];
//     self: HTMLAnchorElement;
// }
// interface child_Nodes{
//     is_list:boolean;
//     nodes: ChildNode[] 
// }
// interface unique_item {
//     class_: boolean,
//     id: boolean,
//     tag: boolean,
//     position: number,
//     value: string
// }
// //functions
var is_item_list = function (obj_alvo) {
    if (obj_alvo.children.length > 1) {
        return true;
    }
    return false;
};
var get_item_list_position = function (obj_alvo) {
    var parent = obj_alvo.parentNode;
    if (parent == null) {
        return -1;
    }
    //get item position
    for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].isEqualNode(obj_alvo)) {
            return i;
        }
    }
    return -1;
};
var getAllClasses = function (obj_alvo) {
    var classes = [];
    for (var i = 0; i < obj_alvo.classList.length; i++) {
        classes.push(obj_alvo.classList.item(i) + "");
    }
    return classes;
};
var get_unique_class_context = function (classes, context) {
    if (classes === void 0) { classes = []; }
    for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
        var c = classes_1[_i];
        var class_ = context.querySelectorAll(".".concat(c));
        if (class_.length == 1) {
            return c;
        }
    }
    return null;
};
var is_unique_tag_context = function (tag, context) {
    var _tags = context.children;
    if (_tags.length == 1) {
        return true;
    }
    return false;
};
var extractor = function (obj_alvo) {
    if (obj_alvo.tagName.toLowerCase() == "body") {
        return "body";
    }
    if (obj_alvo.getAttribute("id")) {
        return "|#" + obj_alvo.getAttribute("id");
    }
    var unique_class_document = get_unique_class_context(getAllClasses(obj_alvo), document.querySelector("body"));
    if (unique_class_document) {
        return "|." + unique_class_document;
    }
    var unique_tag_ctx = is_unique_tag_context(obj_alvo.tagName, obj_alvo.parentNode);
    if (unique_tag_ctx) {
        return "|".concat(obj_alvo.tagName);
    }
    if (is_item_list(obj_alvo.parentNode)) {
        var unique_tag_ctx_1 = is_unique_tag_context(obj_alvo.tagName, obj_alvo.parentNode);
        if (unique_tag_ctx_1) {
            return "|".concat(obj_alvo.tagName);
        }
        var unique_class_ctx = get_unique_class_context(getAllClasses(obj_alvo), obj_alvo.parentNode);
        if (unique_class_ctx) {
            return "|." + unique_class_ctx;
        }
        var item_position = get_item_list_position(obj_alvo);
        return "|".concat(obj_alvo.tagName, "[").concat(item_position, "]");
    }
    return "ué";
};
// iteractor
document.addEventListener("click", function (event) {
    // console.log(event);
    var target = event.target;
    var path = "";
    var temp = target;
    while (temp.tagName.toLowerCase() !== "body") {
        path += extractor(temp);
        temp = temp.parentNode;
        if (path.indexOf("#") !== -1)
            break;
    }
    console.log(path.split("|").reverse());
});
