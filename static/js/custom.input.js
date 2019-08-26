/**
 *  const
 */
const VESSEL_IMO = "船舶航次：";
const BAY_INDEX_TIP = "贝位号: ";
const TIP_PLEASE_RESELECT = "请重新选择";
const IS_TO_RESELECT= "确认重新组贝？";
const TIP_RESET_BAY_SUCCESS = "重新组贝成功";
/**
 *  initialize
 */
let selected_vessel = $(`#vesselSelect option:selected`).val();
let combinedBay20inch = [];
let combinedBay40inch = [];
let selected_bay = '';
// $(`.bay-struct-define`).style.display = 'none';
// let getTable = document.getElementById("table-bay-struct");
// getTable.style.display='none';
// set table_bay_struct display: none
// let getTable = document.getElementById("table-bay-struct");
// getTable.style.display='none';

$(`button[id="add-vessel-submit"]`).click(function () {
    let ves_name = $(`input[id="vessel-name"]`)[0].value;
    let ves_len = $(`input[id="vessel-length"]`)[0].value;
    let ves_wid = $(`input[id="vessel-width"]`)[0].value;
    let ves_fr_len = $(`input[id="vessel-front-length"]`)[0].value;
    let bay_20_num = $(`input[id="bay-inch20-num"]`)[0].value;
    let eng_pos = $(`input[id="engine-pos"]`)[0].value;
    let eng_wid = $(`input[id="engine-width"]`)[0].value;
    let deck_max_lay = $(`input[id="deck-max-layer-num"]`)[0].value;
    let cab_max_lay = $(`input[id="cabin-max-layer-num"]`)[0].value;
    let deck_max_col = $(`input[id="deck-max-col-num"]`)[0].value;
    let cab_max_col = $(`input[id="cabin-max-col-num"]`)[0].value;
    let ves_imp_voy = $(`input[id="vessel-import-voy"]`)[0].value;
    let ves_exp_voy = $(`input[id="vessel-export-voy"]`)[0].value;
    let plan_ber_pos = $(`input[id="vessel-plan-ber-pos"]`)[0].value;
    let real_ber_pos = $(`input[id="vessel-real-ber-pos"]`)[0].value;
    let ves_ber_dir = $(`input[id="vessel-ber-dir"]`)[0].value;

    // disable not equals
    if (deck_max_col !== cab_max_col){
        alert("请输入相同列数！");
        return false;
    }
    let data = {
        ves_name: ves_name,
        ves_len: ves_len,
        ves_wid: ves_wid,
        ves_fr_len: ves_fr_len,
        bay_20_num: bay_20_num,
        eng_pos: eng_pos,
        eng_wid: eng_wid,
        deck_max_lay: deck_max_lay,
        cab_max_lay: cab_max_lay,
        deck_max_col: deck_max_col,
        cab_max_col: cab_max_col,
        ves_imp_voy: ves_imp_voy,
        ves_exp_voy: ves_exp_voy,
        plan_ber_pos: plan_ber_pos,
        real_ber_pos: real_ber_pos,
        ves_ber_dir: ves_ber_dir,
    };
    if (!ves_name) {
        // console.log("Vessel NAME IS NULL!");
        alert("Vessel NAME IS NULL!");
        return false;
    }
    $.ajax({
        url: '/vesselStruct/add_vessel/',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (res) {
            // console.log(res);
            location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
        dataType: "json",
    });
});
/**
 *  zoom in and zoom out
 */
function setZoom(zoom,el) {
    let transformOrigin = [0,0];
    el = el || instance.getContainer();
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
function showVal(a){
    let zoomScale = Number(a)/10;
    setZoom(zoomScale,document.getElementsByClassName('bayStructArea')[0])
}
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
    // set isInverse as args to control direction
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
/**
 * bay
 */
function insertBay(bayLists, direction){
    let bay_num = bayLists.inch20.length;
    function drawBay(val,args_dir) {
        let bayIndex = bayLists.inch20[val].bayRealIndex;
        let bayId = bayLists.inch20[val].id;
        $('.bayArea_40').append(`<div id= ${bayId} class="bayZone_inch40"></div>`);
        $('.bayArea_20').append(`<div id= ${bayId} title=${bayIndex} 
                                    bay_index=${bayIndex} class="bayZone_20">`+
                                    `<span class="bay20Index">${bayIndex}</span>`+
                                `</div>`);
    }
    let isInverse = true;
    directionDealer(bay_num, direction, drawBay, isInverse);
}
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
    let ves_name = res.ves_name;
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

    // update bay-struct-define
    $( `#bay-define-area`)
        .append(`<div class="bay-struct-define">`+
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
    for(let k=0; k<col_index_deck_list.length; k++){
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
    // layer of bay
    let area_size = ['1000px', '650px'];
    let title = '定义贝位结构 --- ' + '船号：' + ves_name;
    // 当前贝位结构
    // 编辑 确认
    // 当前贝位结构情况
    // 点击编辑 按钮 则 可以对当前贝位结构（定义/未定义）进行更新操作
    //      支持 selectable 一个  多个 ---> jquery UI
    // 点击 确认 按钮 则 对当前贝位结构信息（更新/未更新）提交

    //生成模态框，点击贝位编辑箱位
    layer.open({
        type: 1,
        title: title,
        area: area_size, //宽高
        closeBtn: 1,
        shadeClose: true,
        skin: '',
        content: $(`#bay-define-area`),
        btn: ['确认', '取消'],
        btn1: function(){
            console.log("I am confirm");
            createBayInfoAfterEdit();
            layer.close(layer.index);
        },
        btn2: function(){
            console.log("I am cancel");
        },
        end: function () {
        document.getElementById('bay-define-area').style.display = "none";
        }
    });
    function createBayInfoAfterEdit(){
        let data_deck = [];
        let data_cab = [];
        for(let i=0; i<lay_index_deck.length; i++) {
            data_deck.push(
                {   'layer_index':lay_index_deck[i],
                    'data_list': [],
                });
            let parent = $(`div[pos_z=${lay_index_deck[i]}]`);
            for (let m=0;m<parent.length; m++){
                let child = parent[m];
                if (child.className === 'con-zone-initial'){
                    data_deck[i].data_list.push('1');
                }
                else {
                    data_deck[i].data_list.push('0');
                }
            }
        }
        for(let j=0; j<lay_index_cab.length; j++) {
            data_cab.push(
                {   'layer_index':lay_index_cab[j],
                    'data_list': [],
                });
            let parent = $(`div[pos_z=${lay_index_cab[j]}]`);
            for (let k=0;k<parent.length; k++){
                let child = parent[k];
                if (child.className === 'con-zone-initial'){
                    data_cab[j].data_list.push('1');
                }
                else {
                    data_cab[j].data_list.push('0');
                }
            }
        }
        let selected_ves = $(`#vesselSelect option:selected`).val();
        let data = {
            'vessel': selected_ves,
            'bay_index': selected_bay,
            'deck': data_deck,
            'cab': data_cab,
        };
        $.ajax({
            url: '/vesselStruct/bay_struct_define/',
            type: 'POST',
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res);
                alert("请求通过");
                // // reload page, update bay info
                // location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
            },
            dataType: "json",
        });
    }
    // button func in layer
    $(`.con-zone-initial`).on('dblclick', function () {
        let pos_x = this.attributes[1].value;
        let pos_y = this.attributes[2].value;
        let pos_z = this.attributes[3].value;
        let test = $(this).attr("pos_x");
        console.log(test);
        $(this).addClass("bay-struct-zone-discard").removeClass("con-zone-initial");
        // console.log(this.attributes[1].value);
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
            $(`.newBayArea`).append(`<div id= ${itemId} bay_index=${bayIndex} 
                class="newBay20 bay">` +
                `<span class="newBay20Index">${dataList[index].bayInch20[0].index}</span>` +
                `</div>`);
        } else {
            if (bay_dir === 'R'){
                let bay40_index = dataList[index].bayInch40[0].index;
                let bay20_left = dataList[index].bayInch20s[1].index;
                let bay20_right = dataList[index].bayInch20s[0].index;
                $(`.newBayArea`).append(`<div id= ${itemId} class="comBay20_40">` +
                    `<div class="newBay40InCom bayInfo">` +
                    `<span class="newBay40IndexInCom">${bay40_index}</span>` +
                    `</div>` +
                    `<div class="newBay20InComParent">` +
                    `<div class="newBay20InComLeft bay" bay_index=${bay20_left}>`+
                    `<span class="newBay20IndexInCom">${bay20_left}</span></div>` +
                    `<div class="newBay20InComRight bay" bay_index=${bay20_right}>`+
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
                    `<div class="newBay40InCom bayInfo">` +
                    `<span class="newBay40IndexInCom">${bay40_index}</span>` +
                    `</div>` +
                    `<div class="newBay20InComParent">` +
                    `<div class="newBay20InComLeft bay" bay_index=${bay20_left}>`+
                    `<span class="newBay20IndexInCom">${bay20_left}</span></div>` +
                    `<div class="newBay20InComRight bay" bay_index=${bay20_right}>`+
                    `<span class="newBay20IndexInCom">${bay20_right}</span></div></div>` +
                    `</div>`);
            }
        }
    };
    let isInverse = true;
    directionDealer(newBay_num, dir, drawNewBay, isInverse);
    $(`.bay`).on('click', function () {
        selected_bay = this.attributes['bay_index'].value;
        console.log(selected_bay);
        // if bay-struct-table exist?
        if($(`#bay-define-area`)){
            $(`#bay-define-area`).empty();
        }
        document.getElementById('bay-define-area').style.display = "";
        let index = this.childNodes[0].innerText;
        let ves_selected = $(`#vesselSelect option:selected`).val();
        $.ajax({
            url: '/vesselStruct/define_bay_struct/',
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
 *  select bay
 */
function selectToInch40(leftBay,rightBay,comBayIndex){
    let span_bayIndex = `<span class="bay40Index">${comBayIndex}</span>`;
    $(`.bayArea_40 div[id=${leftBay}]`)
        .addClass("leftBaySelected combined")
        .append(span_bayIndex);
    $(`.bayArea_40 div[id=${rightBay}]`)
        .addClass("rightBaySelected combined")
        .append(span_bayIndex);
}
function clearSelected(){
    $(`.bayZone_20.ui-selected`)
        .removeClass("ui-selected")
        .children().removeClass("ui-selected");
}
/**
 * selectable
 */
function setStopOfSelectable(engineList) {
    $(`#selectable`).selectable({
        stop: function() {
            let engineBodyBays = [];
            for(let j=0;j<engineList.length;j++){
                engineBodyBays.push(engineList[j].toString());
            }
            let selectedBay = $(`.bayZone_20.ui-selected`);
            let isNumSelectRight = selectedBay.length === 2;
            if(isNumSelectRight){
                let isReselect =
                    isExist(combinedBay20inch,selectedBay[0].id) ||
                    isExist(combinedBay20inch,selectedBay[1].id);
                let isNextTo =
                    toAbsent(parseInt(selectedBay[0].id) -
                        parseInt(selectedBay[1].id)) === 1;
                let isEngine =
                    isExist(engineBodyBays,selectedBay[0].title) ||
                    isExist(engineBodyBays,selectedBay[1].title);
                // TODO: add left to right constraint
                if(isReselect || !isNextTo || isEngine) {
                    alert(TIP_PLEASE_RESELECT);
                    clearSelected();
                }
                else {
                    let leftBayId = selectedBay[0].id;
                    let rightBayId = selectedBay[1].id;
                    combinedBay20inch.push(leftBayId);
                    combinedBay20inch.push(rightBayId);
                    let combinedBayInch40Index =
                        numToIdString((leftBayId*2-1+rightBayId*2-1)/2);
                    combinedBay40inch.push(combinedBayInch40Index);
                    selectToInch40(leftBayId,rightBayId,combinedBayInch40Index);
                }
            }
            else {
                alert(TIP_PLEASE_RESELECT);
                clearSelected();
            }
        }
    });
}
function disableSelectable() {
    $(`#selectable`).selectable({
        disabled: true
    });
}
/**
 *  combination buttons
 */
function disableBayCombine(eng_list){
    for(let i=0; i<eng_list.length; i++){
        let ind = eng_list[i].toString();
        $(`div[bay_index=${ind}]`).addClass("engineBody");
    }
}
function get_combined_info (){
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
function combineReset() {
    alert(IS_TO_RESELECT);
    selected_vessel = $(`#vesselSelect option:selected`).val();
    $.ajax({
        url: '/vesselStruct/reset_bay_combine/',
        type: 'POST',
        data: {
            name: selected_vessel,
            type: 'reset',
        },
        dataType: "json",
        success: function (res) {
            // console.log(res);
            let num = res.number;
            let dir = res.bayDirection;
            let engBodyList = res.engineRoomIndex;
            $(`.newBayArea`)[0].style.display = 'none';
            $(`.bayCombineInfo`)[0].disabled = true;
            insertBay(BayNumToRealIndexList(num), dir);
            $(`.reStartCombine`)[0].disabled = true;
            disableBayCombine(engBodyList);
            setStopOfSelectable(engBodyList);
            $(`.confirmCombine`)[0].disabled = false;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
    });
}
function combineToConfirm (){
    let context = {
        vessel_name: selected_vessel,
        bayInch20s: combinedBay20inch,
        bayInch40s: combinedBay40inch,
    };
    disableSelectable();
    $.ajax({
        url: '/vesselStruct/edit_bay/',
        type: 'POST',
        data: JSON.stringify(context),
        success: function(res){
            // console.log(res);
            alert(TIP_RESET_BAY_SUCCESS);
            $(`.bayCombineInfo`)[0].disabled = true;
        },
        dataType: "json",
    });
}
