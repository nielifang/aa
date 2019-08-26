let container_object;
let container_list_object;
let bay_object;
let box_object;
let yard_yardcel;
let yard_status;
let yard_ctnno;
let yard_strloaunlsig;
let yard_ctntyp;
let yard_ctnwegt;
let yard_unloadport;
let yard_size;
let yard_owner;
let yard_loaVesTim;
let yard_color;
let color_old;

// declare selected box and bay
let selected_box = '';
let selected_bay = '';

// initial container_list for droppable
let loaded_con = [];

// test area
let test_count = 0;
// table
function fun_infor(obj) {
    color_old = obj.style.backgroundColor;
    // obj.style.backgroundColor = "yellow";
    document.getElementById("add1").innerText = yard_yardcel[obj.id];
    document.getElementById("add2").innerText = yard_status[obj.id];
    document.getElementById("add3").innerText = yard_ctnno[obj.id];
    document.getElementById("add4").innerText = yard_strloaunlsig[obj.id];
    document.getElementById("add5").innerText = yard_ctntyp[obj.id];
    document.getElementById("add6").innerText = yard_ctnwegt[obj.id];
    document.getElementById("add7").innerText = yard_unloadport[obj.id];
    document.getElementById("add8").innerText = yard_size[obj.id];
    document.getElementById("add9").innerText = yard_owner[obj.id];
    document.getElementById("add10").innerText = yard_loaVesTim[obj.id];
}

function re_fun_infor(obj) {
    // obj.style.backgroundColor = yard_color[obj.id];
}

function showYardInfo() {
    // $(`.yardInfo`).disabled
    // initial basic div
    $(`.YARD-AREA`).append(`<div class="bay_blank">贝位</div>`)
        .append(`<div class="bay_Y"></div>`)
        .append(`<div class="box_title"></div>`)
        .append(`<div class="box_area"></div>`);
    //这里是写出贝位
    for (let i = 0; i < 90; i++) {
        let bay = 2 * i + 1;
        $(`.bay_Y`).append(`<div class="bay_Y_num">${bay}</div>`);
    }
    // 增加列号
    let box_title_list = ["A", "B", "C", "D", "E", "F"];
    let col_list = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for(let i=0; i<box_title_list.length; i++){
        let index = box_title_list[i];
        let box_sub_title = "box_" + index + "_title";
        let box_sub_name = index + "箱区";
        $(`.box_title`).append(`<div class=${box_sub_title}>`+
            `<div class="box_name">${box_sub_name}</div></div>`);
        for(let i = 0; i < col_list.length; i++){
            $(`div[class=${box_sub_title}]`).append(`<div class="box_col">${col_list[i]}</div>`);
        }
    }
    //这里是画箱子   箱区  贝位 列
    for(let i=0; i<box_title_list.length; i++){
        let box_area_sub = "box_" + box_title_list[i];
        let yard_add = box_title_list[i];
        $(`.box_area`).append(`<div class=${box_area_sub}></div>`);
        for(let j=0; j<900; j++){
            let bay_str = String(parseInt(j / 10) * 2 + 1);
            let col_str = col_list[j % 10];
            $(`div[class=${box_area_sub}]`)
                .append(`<div class="container-all"`+
                ` yard=${yard_add} bay=${bay_str} col=${col_str} onclick="container_add(this)"></div>`);
        }
    }
}

function container_add(container_this) {
    let data = {
        "Box": container_this.getAttribute("yard"),
        "Bay": container_this.getAttribute("bay")
    };
    $.ajax({
        url: "/yard/operation/load/",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        dataType: "text",
        success: function (yard_database) {
            yard_database = JSON.parse(yard_database);

            yard_yardcel = yard_database["yard_yardcel"];
            yard_status = yard_database["yard_status"];
            yard_ctnno = yard_database["yard_ctnno"];
            yard_strloaunlsig = yard_database["yard_strloaunlsig"];
            yard_ctntyp = yard_database["yard_ctntyp"];
            yard_ctnwegt = yard_database["yard_ctnwegt"];
            yard_unloadport = yard_database["yard_unloadport"];
            yard_size = yard_database["yard_size"];
            yard_owner = yard_database["yard_owner"];
            yard_loaVesTim = yard_database["yard_loaVesTim"];
            yard_color = yard_database["yard_color"];
            //selected box and bay
            selected_box = yard_database["selected_box"];
            selected_bay = yard_database["selected_bay"];

            //console.log(yard_database);
            // delete class con-exist
            if($(`.con-exist`)){
                $(`.con-exist`).removeClass("con-exist");
            }

            let col_list = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
            let lay_list = ["1", "2", "3", "4", "5"];
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 10; j++) {
                    let find_str = col_list[j] + lay_list[i];
                    document.getElementById(find_str).children[0].style.backgroundColor = yard_color[find_str];
                    // add border
                    if(yard_color[find_str] === "red"){
                        $(`div[col_lay=${find_str}]`).addClass("con-exist");
                    }
                    $(`td[id=${find_str}`).addClass("border2solid");
                }
            }
            // register draggable func
            $(`.con-exist`).draggable
            ({
                revert: "invalid",
                snap: '.con-zone-initial, .con-zone-exist',
                snapMode: 'corner',
                snapTolerance: '22',
            });

            // add container_information_col > td : border
            let child_list = $(`tr[id="container_information_col"]`)[0].children;
            for(let i=1;i<child_list.length;i++){
                child_list[i].style.border="2px solid blanchedalmond";
            }
            // console.log(child_list);
            con_tab.hidden = false;
        },
        error: function (msg) {
            //alert("发送失败");
        }
    });

    //判断空值还原颜色
    if (container_object) {
        container_object.style.backgroundColor = "darksalmon";
        for (let i = 0; i < 10; i++) {
            container_list_object[i].style.backgroundColor = "darksalmon";
        }
        let con_tab = document.getElementById("container_information");
        con_tab.style.left = "383px";
        con_tab.style.top = "100px";
    }
    if (bay_object) {
        bay_object.style.backgroundColor = "skyblue";
    }
    if (box_object) {
        box_object.style.backgroundColor = "skyblue";
    }

    //////////////////操作table
    let yard = container_this.getAttribute("yard");
    let bay = container_this.getAttribute("bay");
    let con_tab = document.getElementById("container_information");
    let pos_str = yard + "箱区" + "*" + bay + "贝位" + "*" + "详细信息";
    document.getElementById("container_information_title").innerText = pos_str;


    /////////////更改每个箱位的颜色

    //更改表格属性颜色  yard_list
    //在点击后获取到箱区 贝位相同的集装箱箱位
    //在确定了层和列后设置颜色
    //改变集装箱颜色 贝位颜色 箱区颜色
    container_this.style.backgroundColor = "red";

    //改变整个贝位的颜色

    let bay_list = document.getElementsByClassName("container-all");

    let bay_obj_list = [];
    for (let i = 0; i < bay_list.length; i++) {
        let yard_list_str = bay_list[i].getAttribute("yard");
        let bay_list_str = bay_list[i].getAttribute("bay");
        if (yard_list_str === yard && bay_list_str === bay) {
            bay_obj_list.push(bay_list[i]);
        }
    }
    for (let i = 0; i < 10; i++) {
        bay_obj_list[i].style.backgroundColor = "red";
    }

    //传递整个贝位
    container_list_object = bay_obj_list;

    let bay_list_1 = document.getElementsByClassName("bay_Y_num");
    for (let i = 0; i < 90; i++) {
        let bay_obj = bay_list_1[i];
        if (bay_obj.innerHTML === bay) {
            bay_obj.style.backgroundColor = "red";
            bay_object = bay_obj;
            break;
        }
    }

    let box_list = document.getElementsByClassName("box_name");
    for (let i = 0; i < 6; i++) {
        let box_obj = box_list[i];
        if (box_obj.innerHTML === (yard + "箱区")) {
            box_obj.style.backgroundColor = "red";
            box_object = box_obj;
            break;
        }
    }
    //传递集装箱
    container_object = container_this;
}

function des() {
    let con_tab = document.getElementById("container_information");
    con_tab.hidden = true;
    // 还原 颜色 坐标
    container_object.style.backgroundColor = "darksalmon";
    for (let i = 0; i < 10; i++) {
        container_list_object[i].style.backgroundColor = "darksalmon";
    }

    bay_object.style.backgroundColor = "skyblue";
    box_object.style.backgroundColor = "skyblue";
    // con_tab.style.left = "383px";
    // con_tab.style.top = "100px";

    let col_list = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let lay_list = ["1", "2", "3", "4", "5"];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            let find_str = col_list[j] + lay_list[i];
            document.getElementById(find_str).style.backgroundColor = "wheat";
        }
    }
}
/***
 *
 *  zoom in and out
 */
function setZoom(zoom,el) {
    let transformOrigin = [0,0];
    // el = el || el.getContainerNode();
    let p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
    for (let i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }
    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;
}

function vessel_size_toggle(a){
    let zoomScale = Number(a)/10;
    setZoom(zoomScale,document.getElementById('vessel-area'));
}

function yard_size_toggle(b) {
    let zoomScale = Number(b)/10;
    setZoom(zoomScale,document.getElementById('yard-area'));
}

/**
 * ***************vessel area*****************
 */
/**
 *  const
 */
const VESSEL_IMO = "船舶航次：";
const BAY_INDEX_TIP = "贝位号: ";
/**
 *  variable initialize
 */
let selected_vessel = $(`#vesselSelect option:selected`).val();
/**
 * @classname
 */
/*
    pos_x : bayIndex
    pos_y : rowIndex
    pos_z : layerIndex
 */
/**
 * custom function
 */
// id number to string
function numToIdString(num) {
    return num < 10 ? "0" + num.toString() : num.toString();
}
// is exist in array (str)
function isExist(array,value){
    for(let i=0;i<array.length;i++){
        if(array[i] === value){
            return true;
        }
    }
    return false;
}
function toAbsent(value) {
    return value>0?value:-value;
}
function directionDealer(num, dir, func, isInverse) {
    // set isInverse as args to control
    if (isInverse) {
        if (dir === 'L') {
        for (let a=0; a<num; a++) {
            func(a,dir);
        }
        }
        else {
            for (let b=num-1; b>=0; b--) {
                func(b,dir);
            }
        }
    }
    else {
        if (dir === 'L') {
        for (let d=num-1; d>=0; d--) {
            func(d,dir);
        }
        }
        else {
            for (let c=0; c<num; c++) {
                func(c,dir);
            }
        }
    }
}
/**
 *  initialize bay area
 */
function BayNumToRealIndexList(bayNum) {
    let bay = {};
    bay.inch20 = [];
    for (let i=0;i<bayNum;i++){
        bay.inch20[i] = {
            "id":i+1,
            "bayRealIndex":numToIdString(i*2+1)
        };
    }
    return bay;
}
// layer above
// layer below
function layerNumToRealIndexList(layerNumAbove,layerNumBelow) {
    let layer = {};
    layer.above = [];
    layer.below = [];
    for (let i=0; i<layerNumAbove; i++){
        layer.above[i] = {
            id: i+1,
            layerRealIndex: numToIdString((i+41)*2),
        }
    }
    for (let j=0; j<layerNumBelow; j++){
        layer.below[j] = {
            id: j+1,
            layerRealIndex: numToIdString((j+1)*2),
        }
    }
    return layer;
}
//
function getDeckLayIndex(real, max) {
    let temp=[];
    for(let i=0; i<(real? real:max);i++){
        temp.push(numToIdString((41+i)*2));
    }
    // console.log("deckBayIndex: " + temp);
    return temp;
}
function getCabLayIndex(real, max) {
    let temp =[];
    for(let j=0; j<(real? real:max); j++) {
        temp.push(numToIdString((j+1)*2));
    }
    // console.log("cabBayIndex: " + temp);
    return temp;
}
function createColIndex(num_of_col) {
    let temp_list = [];
    if (num_of_col%2 === 0){
        // 00 line
        let sub = num_of_col/2;
        for(let i=sub; i>0; i--){
            temp_list.push(numToIdString(i*2));
        }
        for(let j=0; j<sub; j++){
            temp_list.push(numToIdString((j+1)*2-1));
        }
    }
    else {
        let sub = (num_of_col-1)/2;
        for(let i=sub; i>0; i--){
            temp_list.push(numToIdString(i*2));
        }
        temp_list.push('00');
        for(let j=0; j<sub; j++){
            temp_list.push(numToIdString((j+1)*2-1));
        }
    }
    // console.log("colIndex: " + temp_list);
    return temp_list;
}
function drawBayStruct(res) {
    // let ves_name = res.ves_name;
    let bay_index = res.bay_index;
    let deck_max_lay = res.bay_struct_max.deck_lay_num_max;
    let cab_max_lay = res.bay_struct_max.cab_lay_num_max;
    let deck_max_col = res.bay_struct_max.deck_col_num_max;
    let cab_max_col = res.bay_struct_max.cab_col_num_max;

    let deck_real_lay = res.real_bay_struct.deck_lay_num_real;
    let cab_real_lay = res.real_bay_struct.cab_lay_num_real;
    let cab_real_col = res.real_bay_struct.cab_col_num_real;
    let deck_real_col = res.real_bay_struct.deck_col_num_real;

    let bay_layer_con_zone = res.bay_layer_con_zone;

    let con_on_vessel = res.con_on_vessel;

    // create bay-structure
    $( `#bay-struct-vessel`).append(`<div class="bay-struct-define">`+
    `<div class="bay-struct-header" name="bay-index">`+
        `<span></span>`+
    `</div>`+
    `<div class="bay-struct-content" name="bay-struct-area">`+
        `<div class="bay-col-index-deck">`+
            `<div class="blank-index-deck"></div>`+
            `<div class="col-index-area-deck"></div>`+
        `</div>`+
        `<div class="bay-deck-lays"></div>`+
        `<div class="vessel-hat">`+
            `<div class="blank-hat-area"></div>`+
            `<div class="hat-area"></div>`+
        `</div>`+
        `<div class="bay-cab-lays"></div>`+
        `<div class="bay-col-index-cab">`+
            `<div class="blank-index-cab"></div>`+
            `<div class="col-index-area-cab"></div>`+
        `</div>`+
    `</div>`+
`</div>`);

    let lay_index_deck = getDeckLayIndex(deck_real_lay,deck_max_lay);
    let lay_index_cab = getCabLayIndex(cab_real_lay,cab_max_lay);

    let col_index_deck_list = createColIndex(deck_real_col? deck_real_col:deck_max_col);
    let col_index_cab_list = createColIndex(cab_real_col? cab_real_col:cab_max_col);

    // console.log(col_index_deck_list);
    // console.log(col_index_cab_list);
    // from up to down
    $(`.bay-struct-header`).children()[0].innerText = '贝位号: '+ bay_index;
    // col-index on deck
    let k;
    for(k=0; k<col_index_deck_list.length; k++){
        let col_index = col_index_deck_list[k];
        $(`.col-index-area-deck`).append(`<div class="col-index-zone">${col_index}</div>`);
    }
    for(let r=0; r<col_index_cab_list.length; r++){
        let col_index = col_index_cab_list[r];
        $(`.col-index-area-cab`).append(`<div class="col-index-zone">${col_index}</div>`);
    }
    //lay
    for(let m=lay_index_deck.length-1; m>=0; m--){
        let lay_index = lay_index_deck[m];
        $(`.bay-deck-lays`).append(`<div class="bay-deck-single-lay"><div class="bay-lay-index">${lay_index}</div><div class="bay-lay-zones" layer=${lay_index}></div></div>`);
        for(let n=0; n<col_index_deck_list.length; n++){
            let col_index = col_index_deck_list[n];
            if(bay_layer_con_zone.length === 0) {
                $(`div[layer=${lay_index}]`).append(`<div class="con-zone-initial" pos_x=${bay_index} pos_y=${col_index} pos_z=${lay_index}></div>`);
            }
            else {
                $(`div[layer=${lay_index}]`).append(`<div class="con-zone-after" pos_x=${bay_index} pos_y=${col_index} pos_z=${lay_index}></div>`);
            }
        }
    }
    for(let p=lay_index_cab.length-1; p>=0; p--){
        let lay_index = lay_index_cab[p];
        $(`.bay-cab-lays`).append(`<div class="bay-cab-single-lay"><div class="bay-lay-index">${lay_index}</div><div class="bay-lay-zones" layer=${lay_index}></div></div>`);
        for(let q=0; q<col_index_cab_list.length; q++){
            let col_index = col_index_cab_list[q];
            if(bay_layer_con_zone.length === 0) {
                $(`div[layer=${lay_index}]`).append(`<div class="con-zone-initial" pos_x=${bay_index} pos_y=${col_index} pos_z=${lay_index}></div>`);
            }
            else {
                $(`div[layer=${lay_index}]`).append(`<div class="con-zone-after" pos_x=${bay_index} pos_y=${col_index} pos_z=${lay_index}></div>`);
            }
        }
    }
    // show real con-zone if exist
    if(bay_layer_con_zone.length !== 0) {
         for (let i = 0; i < bay_layer_con_zone.length; i++) {
             let lay_index = bay_layer_con_zone[i].layer_index;
             let con_list = bay_layer_con_zone[i].con_zone_list;
             for (let j=0; j<con_list.length; j++){
                 let pos_y = col_index_deck_list[j];
                 if(con_list[j] === '1'){
                     $(`div[class="con-zone-after"][pos_z=${lay_index}][pos_y=${pos_y}]`).addClass("con-zone-exist");
                 }
             }
         }
    }

    // add container to bay
    for(let i=0;i<con_on_vessel.length;i++){
        let pos_x = con_on_vessel[i].BayNo;
        let pos_y = con_on_vessel[i].ColNo;
        let pos_z = con_on_vessel[i].TireNo;
        let container_type = con_on_vessel[i].CtnTyp;
        let container_no = con_on_vessel[i].CtnNo;
        let con_size = con_on_vessel[i].Size;
        let yard_cel = con_on_vessel[i].YardCel;
        let con_title_info = "箱型："+container_type + '\n' +
                             "尺寸："+con_size + '\n' +
                             "箱号"+container_no + '\n' +
                             "堆场箱位："+yard_cel;
        let obj = $(`div[pos_x=${pos_x}][pos_y=${pos_y}][pos_z=${pos_z}]`);
        obj.prop("title", con_title_info);
        obj.addClass("container-exist-zone").removeClass("con-zone-exist").removeClass("con-zone-initial");
        // color set
        if(container_type === "普通箱"){
            obj.addClass("container-red");
        }
        else if (container_type === "危险箱"){
            obj.addClass("container-yellow");
        }
        else if (container_type === "冷藏箱"){
            obj.addClass("container-blue");
        }
        else {
            obj.addClass("container-yellow");
        }
    }
    $(`.con-zone-initial, .con-zone-exist`).droppable({
        drop: function (event, ui) {
            // container position in yard
            let con_col_lay = ui.draggable[0].attributes.col_lay.value;
            let con_box = selected_box;
            let con_bay = selected_bay;
            // loaded position in vessel
            let val_x = $(this)[0].attributes.pos_x.value;
            let val_y = $(this)[0].attributes.pos_y.value;
            let val_z = $(this)[0].attributes.pos_z.value;
            let pos_yard = con_box + con_bay + con_col_lay;
            let pos_vessel = val_x + val_y + val_z;

            $(this).addClass("blink");
            if(loaded_con.length === 0){
                loaded_con.push({
                    pos_yard: con_box + con_bay + con_col_lay,
                    pos_vessel: val_x + val_y + val_z,
                });
            }
            else {
                let countDif = 0;
                for(let i=0; i<loaded_con.length; i++){
                    if (pos_yard === loaded_con[i].pos_yard && pos_vessel === loaded_con[i].pos_vessel){
                        break;
                    }
                    else if (pos_yard === loaded_con[i].pos_yard && pos_vessel !== loaded_con[i].pos_vessel){
                        loaded_con[i].pos_vessel = pos_vessel;
                    }
                    else if (pos_yard !== loaded_con[i].pos_yard){
                        countDif += 1;
                        if(countDif === loaded_con.length){
                            loaded_con.push({
                                pos_yard: pos_yard,
                                pos_vessel: pos_vessel,
                            });
                        }
                    }
                }
            }
            console.log(loaded_con);
        },
        out: function (event, ui) {
            $(this).removeClass("blink");
        }
    });
}
function createBayCombinationInfo(newList) {
    let newBay_num = newList.data.length;
    let dataList = newList.data;
    let dir = newList.bayDirection;
    // TODO: func to createLoadOrUnloadInfo
    let drawNewBay = function (index, bay_dir) {
        let itemId = dataList[index].id;
        if (dataList[index].type === "single") {
            let bayIndex = dataList[index].bayInch20[0].index;
            $(`.newBayArea`).append(`<div id= ${itemId} bay_index=${bayIndex} class="newBay20 bay-20">` +
                `<span class="newBay20Index">${dataList[index].bayInch20[0].index}</span>` +
                `</div>`);
        } else {
            if (bay_dir === 'R'){
                let bay40_index = dataList[index].bayInch40[0].index;
                let bay20_left = dataList[index].bayInch20s[1].index;
                let bay20_right = dataList[index].bayInch20s[0].index;
                $(`.newBayArea`).append(`<div id= ${itemId} class="comBay20_40">` +
                    `<div class="newBay40InCom bay-40">` +
                    `<span class="newBay40IndexInCom">${bay40_index}</span>` +
                    `</div>` +
                    `<div class="newBay20InComParent">` +
                    `<div class="newBay20InComLeft bay-20">`+
                    `<span class="newBay20IndexInCom">${bay20_left}</span></div>` +
                    `<div class="newBay20InComRight bay-20">`+
                    `<span class="newBay20IndexInCom">${bay20_right}</span></div>` +
                    `</div>` +
                    `</div>`);
            }
            else {
                // bay_dir === 'L'
                let bay40_index = dataList[index].bayInch40[0].index;
                let bay20_left = dataList[index].bayInch20s[0].index;
                let bay20_right = dataList[index].bayInch20s[1].index;
                $(`.newBayArea`).append(`<div id= ${itemId} class="comBay20_40">` +
                    `<div class="newBay40InCom bay-40">` +
                    `<span class="newBay40IndexInCom">${bay40_index}</span>` +
                    `</div>` +
                    `<div class="newBay20InComParent">` +
                    `<div class="newBay20InComLeft bay-20">`+
                    `<span class="newBay20IndexInCom">${bay20_left}</span></div>` +
                    `<div class="newBay20InComRight bay-20">`+
                    `<span class="newBay20IndexInCom">${bay20_right}</span></div></div>` +
                    `</div>`);
            }
        }
    };
    let isInverse = true;
    directionDealer(newBay_num, dir, drawNewBay, isInverse);
    $(`.bay-20`).on('click', function () {
        // if bay-struct-table exist?
        if($(`#bay-struct-vessel`)){
            $(`#bay-struct-vessel`).empty();
        }
        let index = this.childNodes[0].innerText;
        let ves_selected = $(`#vesselSelect option:selected`).val();
        $.ajax({
            url: '/vesselStruct/operation_load/',
            type: 'GET',
            data: {
                name: ves_selected,
                index: index,
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                drawBayStruct(res);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
            },
        });
    });
    $(`[class="newBay20"][id="6"]`).addClass("blink");
    $(`[class="newBay20"][id="7"]`).addClass("blink");
}
/**
 *  vessel creation
 */
function createVesselSide(){
    // $(`.createVessel`)[0].disabled = true;
    if($(`.vesselAreaSide`)){
        $(`.vesselAreaSide`).empty();
    }
    $.ajax({
        url: '/vesselStruct/ves_struct/',
        type: 'GET',
        data: {
            name: selected_vessel,
        },
        dataType: "json",
        success: function (res) {
            // console.log(res);
            let bay_num = res.bay_inch20_num;
            let layerNumAbove = res.max_layer_above_number;
            let layerNumBelow = res.max_layer_below_number;
            let dir = res.bayDirection;
            let eng_list_ind = res.engine_room_index;
            drawVesselStruct(bay_num, layerNumAbove, layerNumBelow, dir, eng_list_ind)
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
    });
}
function drawVesselStruct(bay_num, lay_above_num, lay_below_num, dir, engine_list) {
    let bayLists = BayNumToRealIndexList(bay_num);
    let layerLists = layerNumToRealIndexList(lay_above_num,lay_below_num);
    let conZone_bay_num = bayLists.inch20.length;
    let conZone_layerAbove_num = layerLists.above.length;
    let conZone_layerBelow_num = layerLists.below.length;
    let eng_list_index = engine_list;
    // TODO: change conZoneAbove_inch20 according maxLayer input
    // TODO: tip1: set fixed height according maxLayer input
    let drawVesBayArea = function (index,args_dir) {
        let conZoneBayIndex = bayLists.inch20[index].bayRealIndex;
        $(`.onBoardSide`).append(`<div pos_x=${conZoneBayIndex} class="bayAbove_20"></div>`);
        $(`.belowBoardSide`).append(`<div pos_x=${conZoneBayIndex} class="bayBelow_20"></div>`);
    };
    // initial div: onBoardSide and belowBoardSide
    $(`.vesselAreaSide`).append(`<div class="onBoardSide"></div>`)
        .append(`<div class="belowBoardSide"></div>`);
    let isInverse = true;
    directionDealer(conZone_bay_num,dir,drawVesBayArea,isInverse);
    // zone: bay + layer
    for(let j=0;j<conZone_bay_num;j++){
        let conZoneBayIndex = bayLists.inch20[j].bayRealIndex;
        for(let k=conZone_layerAbove_num-1;k>=0;k--){
            let conZoneLayerIndex = layerLists.above[k].layerRealIndex;
            let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
            $(`.onBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
        }
        for(let m=conZone_layerBelow_num-1;m>=0;m--){
            let conZoneLayerIndex = layerLists.below[m].layerRealIndex;
            let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
            $(`.belowBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
        }
    }
    // css control ves body, engine, and container zone
    $(`.bayAbove_20`).children('div').addClass("vessel_inch20_default");
    $(`.bayBelow_20`).children('div').addClass("vessel_inch20_default");
    // console.log(eng_list_index);
    for (let i=0; i<eng_list_index.length; i++) {
        let index = eng_list_index[i].toString();
        // console.log(index);
        $(`div[p_x=${index}]`).addClass("vesselBody_inch20");
    }
}
/**
 *  combination buttons
 */
function getCombineInfo (){
    // $(`.bayCombineInfo`)[0].disabled = true;
    if($(`.newBayArea`)){
        $(`.newBayArea`).empty();
    }
    selected_vessel = $(`#vesselSelect option:selected`).val();
    $.ajax({
        url: '/vesselStruct/edit_bay/',
        type: 'GET',
        data: {
            name: selected_vessel,
            type: 'current_info',
        },
        dataType: "json",
        success: function (res) {
            // console.log(res);
            createBayCombinationInfo(res);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
    });
}
/**
* OPERATION AREA
*/
// $(`.con`).draggable({ revert: "invalid" });
function confirmOperation() {
    let selected_ves = $(`#vesselSelect option:selected`).val();
    let data = {
        ves_name: selected_ves,
        loaded: loaded_con,
    };
    $.ajax({
        url: "/vesselStruct/operation_load/",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (res) {
            console.log(res);
            alert(res);
            location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
    });
}