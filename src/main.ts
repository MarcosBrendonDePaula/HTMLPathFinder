//constants


// interfaces

// //functions

const is_item_list = (obj_alvo:HTMLAnchorElement):boolean =>{
    if(obj_alvo.children.length > 1){
        return true;
    }
    return false;
}

const get_item_list_position = (obj_alvo:HTMLAnchorElement):number => {
    let parent = obj_alvo.parentNode;
    if(parent == null){ return -1}
    //get item position
    for(let i=0; i<parent.children.length; i++){
        if(parent.children[i].isEqualNode(obj_alvo)){
            return i;
        }
    }
    return -1;
}

const getAllClasses = (obj_alvo:HTMLAnchorElement):Array<string> =>{
    let classes:Array<string> = []
    for( let i=0; i< obj_alvo.classList.length ; i++){
        classes.push(obj_alvo.classList.item(i)+"");
    }
    return classes;
}

const get_unique_class_context = (classes:Array<string> = [], context:HTMLAnchorElement):string|null =>{
    for(let c of classes){
        let class_ = context.querySelectorAll(`.${c}`)
        
        if(class_.length == 1){
            return c;
        }
    }
    return null;
}

const is_unique_tag_context = (tag:string, context:HTMLAnchorElement):boolean =>{
    let _tags = context.children
    let count:number = 0;
    
    for(let i=0; i<_tags.length; i++){
        if(_tags[i].tagName === tag) {
            count++;
        }
        if(count > 1)
            return false;
    }

    return true;
}

const extractor = (obj_alvo:HTMLAnchorElement)=>{
    
    if(obj_alvo.tagName.toLowerCase() == "body"){
        return "body"
    }

    if(obj_alvo.getAttribute("id")) {
        return "|#"+obj_alvo.getAttribute("id")
    }

    let unique_class_document = get_unique_class_context(getAllClasses(obj_alvo), <HTMLAnchorElement>(<unknown>document.querySelector("body")))
    if(unique_class_document) {
        return "|."+unique_class_document;
    }

    let unique_tag_ctx = is_unique_tag_context(obj_alvo.tagName,<HTMLAnchorElement> obj_alvo.parentNode)
    if(unique_tag_ctx) {
        return `|${obj_alvo.tagName}`;
    }

    if(is_item_list(<HTMLAnchorElement>obj_alvo.parentNode)) {
        
        let unique_tag_ctx = is_unique_tag_context(obj_alvo.tagName,<HTMLAnchorElement> obj_alvo.parentNode)
        if(unique_tag_ctx) {
            return `|${obj_alvo.tagName}`;
        }
        
        let unique_class_ctx = get_unique_class_context(getAllClasses(obj_alvo), <HTMLAnchorElement>obj_alvo.parentNode)
        if(unique_class_ctx) {
            return "|."+unique_class_ctx;
        }

        let item_position = get_item_list_position(obj_alvo)
        return `|${obj_alvo.tagName}[${item_position}]`

    }

}

// // iteractor
document.addEventListener("click", (event)=>{
    // console.log(event);
    let target = <HTMLAnchorElement>event.target
    
    let path = ""
    let temp = target; 
    while (temp.tagName.toLowerCase() !== "body") {
        path += extractor(temp)
        temp = <HTMLAnchorElement> temp.parentNode;
        if(path.indexOf("#") !== -1)
            break;
    }
    console.log(path.split("|").reverse());
})

document.querySelector("#load_btn")?.addEventListener("click",()=>{
    let vb:Element = document.querySelector("#__virtual_body__") || new Element();
    let content = (<HTMLTextAreaElement>document.querySelector("#url"))?.value || "";
    content = content.replace('href','data-href');
    content = content.replace('type="submit"','type="button"');
    vb.innerHTML = content 
});
