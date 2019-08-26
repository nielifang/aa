/**
 *  const
 */

var open = function (title, inputContent) {
    $(`body`).append(`<div class="shadow">
						<div class="layer">
							<div class="title">${title || '提示'}
								<div class="close">x</div>
							</div>
							</div>
							</div>`);
    $(`.layer`).append(inputContent);
    var canMove = false;
    var offsetX = 0,
        offsetY = 0;
    $(`.title`).mousedown(function (e) {
        canMove = true;
        offsetX = e.pageX - $(`.layer`).offset().left;
        offsetY = e.pageY - $(`.layer`).offset().top
    });
    //失去焦点事件
    $(Window).blur(function () {
        canMove = false
    });

    $(`.title`).mouseup(function () {
        canMove = false
    });
    var calPosition = (left, top, maxLeft, maxTop, minLeft = 0, minTop = 0) => {
        if (left < minLeft)
            left = minLeft;
        else if (left > maxLeft)
            left = maxLeft;

        if (top < minTop) top = minTop;
        else if (top > maxTop)
            top = maxTop;
        return {
            left,
            top
        }
    };

    $(window).mousemove(function (e) {
        //					e.preventDefault()
        if (canMove) {
            var left = e.pageX - offsetX;
            var top = e.pageY - offsetY;
            var maxLeft = $(window).innerWidth() - $(`.title`).innerWidth();
            var maxTop = $(window).innerHeight() - $(`.layer`).innerHeight();
            var position = calPosition(left, top, maxLeft, maxTop);

            $(`.layer`).css({
                left: position.left,
                top: position.top
            })
        }

    });

    $(`.close`).click(function () {
        $(`.shadow`).remove();
    });
};


function add_vessel() {
    var ves_info = `<div class="form-row">
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">船名</span>
            </div>
        <input type="text" class="form-control" id="vessel-name">
        </div>
    </div>   
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">船长</span>
            </div>
        <input type="text" class="form-control" id="vessel-length" value="360">
        <div class="input-group-append">
            <span class="input-group-text">m</span>
        </div>
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">船舶宽度</span>
            </div>
        <input type="text" class="form-control" id="vessel-width" value="80">
        <div class="input-group-append">
            <span class="input-group-text">m</span>
        </div>
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">20尺贝数</span>
            </div>
        <input type="text" class="form-control" id="bay-inch20-num" value="45">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">机舱位置</span>
            </div>
        <input type="number" class="form-control" id="engine-pos" value="31">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">机舱宽度</span>
            </div>
        <input type="number" class="form-control" id="engine-width" value="2">
        </div>
    </div>

    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">甲板最大层高</span>
            </div>
        <input type="number" class="form-control" id="deck-max-layer-num" value="6">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">舱内最大层深</span>
            </div>
        <input type="number" class="form-control" id="cabin-max-layer-num" value="5">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">甲板最大列数</span>
            </div>
        <input type="number" class="form-control" id="deck-max-col-num" value="7">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">舱内最大列数</span>
            </div>
        <input type="number" class="form-control" id="cabin-max-col-num" value="4">
     
    </div>
</div>
</div>
<button id="add-vessel-submit" class="btn btn-primary" onclick="submitVesInfo()">提交</button>`;
    open("自定义船舶结构", ves_info);

}

function submitVesInfo() {

    let ves_name = $(`input[id="vessel-name"]`)[0].value;
    let ves_len = $(`input[id="vessel-length"]`)[0].value;
    let ves_wid = $(`input[id="vessel-width"]`)[0].value;
    let bay_20_num = $(`input[id="bay-inch20-num"]`)[0].value;
    let eng_pos = $(`input[id="engine-pos"]`)[0].value;
    let eng_wid = $(`input[id="engine-width"]`)[0].value;
    let deck_max_lay = $(`input[id="deck-max-layer-num"]`)[0].value;
    let cab_max_lay = $(`input[id="cabin-max-layer-num"]`)[0].value;
    let deck_max_col = $(`input[id="deck-max-col-num"]`)[0].value;
    let cab_max_col = $(`input[id="cabin-max-col-num"]`)[0].value;

    if (ves_len > 500){
        alert("船舶长度应小于500米");
        return false;
    }
     if (!ves_name) {
        alert("Vessel NAME IS NULL!");
        return false;
    }

    let data = {
        ves_name: ves_name,
        ves_len: ves_len,
        ves_wid: ves_wid,
        bay_20_num: bay_20_num,
        eng_pos: eng_pos,
        eng_wid: eng_wid,
        deck_max_lay: deck_max_lay,
        cab_max_lay: cab_max_lay,
        deck_max_col: deck_max_col,
        cab_max_col: cab_max_col,
    };

     $.ajax({
        url: '/vessel/add_vessel/',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (res) {
            alert("保存成功");
            let dir = 'L';
            drawVessel(bay_20_num,deck_max_lay,cab_max_lay,dir,res);
            // location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        },
        dataType: "json",
    });
}


function drawVessel(bay_num, lay_above_num, lay_below_num,dir, engine_list) {

 let bayLists = BayNumToRealIndexList(bay_num);
    let layerLists = layerNumToRealIndexList(lay_above_num, lay_below_num);
    let conZone_bay_num = bayLists.inch20.length;
    let conZone_layerAbove_num = layerLists.above.length;
    let conZone_layerBelow_num = layerLists.below.length;
    let eng_list_index = engine_list;
    // initial above and below
    $(`.vesselAreaSide`).append(`<div class="onBoardSide"></div>`)
        .append(`<div class="belowBoardSide"></div>`);
    // TODO: change conZoneAbove_inch20 according maxLayer input
    // TODO: tip1: set fixed height according maxLayer input
    let drawVesBayArea = function (index, args_dir) {
        let conZoneBayIndex = bayLists.inch20[index].bayRealIndex;
        $(`.onBoardSide`).append(`<div pos_x=${conZoneBayIndex} class="bayAbove_20"></div>`);
        $(`.belowBoardSide`).append(`<div pos_x=${conZoneBayIndex} class="bayBelow_20"></div>`);
    };
    let isInverse = true;
    directionDealer(conZone_bay_num, dir, drawVesBayArea, isInverse);
    // zone: bay + layer
    for (let j = 0; j < conZone_bay_num; j++) {

        let conZoneBayIndex = bayLists.inch20[j].bayRealIndex;
        for (let k = conZone_layerAbove_num - 1; k >= 0; k--) {
            let conZoneLayerIndex = layerLists.above[k].layerRealIndex;
            let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
            $(`.onBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
        }
        if(j < 4){
            for (let m = j; m >= 0; m--) {
            let conZoneLayerIndex = layerLists.below[m].layerRealIndex;
            let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
            $(`.belowBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
        }
        }else if(j >conZone_bay_num-6) {
            for (let n = conZone_bay_num-j-1; n >= 0; n--) {
                let m = conZone_layerBelow_num-1 ;
                let conZoneLayerIndex = layerLists.below[m].layerRealIndex;
                m = m-1;
                let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
                $(`.belowBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
            }
        }else
            {
                for (let m = conZone_layerBelow_num - 1; m >= 0; m--) {
                    let conZoneLayerIndex = layerLists.below[m].layerRealIndex;
                    let item = `<div class="conZone_20" p_x=${conZoneBayIndex} p_z=${conZoneLayerIndex}></div>`;
                    $(`.belowBoardSide div[pos_x=${conZoneBayIndex}]`).append(item);
                }
            }
    }
    // css control ves body, engine, and container zone
    $(`.bayAbove_20`).children('div').addClass("vessel_inch20_default");
    $(`.bayBelow_20`).children('div').addClass("vessel_inch20_default");
    // console.log(eng_list_index);
    for (let i = 0; i < eng_list_index.length; i++) {
        let index = eng_list_index[i].toString();
        // console.log(index);
        $(`div[p_x=${index}]`).addClass("vesselBody_inch20");
    }
}












function BayNumToRealIndexList(bayNum) {
    let bay = {};
    bay.inch20 = [];
    for (let i = 0; i < bayNum; i++) {
        bay.inch20[i] = {
            "id": i + 1,
            "bayRealIndex": numToIdString(i * 2 + 1)
        };
    }
    return bay;
}

// layer above
// layer below
function layerNumToRealIndexList(layerNumAbove, layerNumBelow) {
    let layer = {};
    layer.above = [];
    layer.below = [];
    for (let i = 0; i < layerNumAbove; i++) {
        layer.above[i] = {
            id: i + 1,
            layerRealIndex: numToIdString((i + 41) * 2),
        }
    }
    for (let j = 0; j < layerNumBelow; j++) {
        layer.below[j] = {
            id: j + 1,
            layerRealIndex: numToIdString((j + 1) * 2),
        }
    }
    return layer;
}



function directionDealer(num, dir, func, isInverse) {
    // set isInverse as args to control
    if (isInverse) {
        if (dir === 'L') {
            for (let a = 0; a < num; a++) {
                func(a, dir);
            }
        } else {
            for (let b = num - 1; b >= 0; b--) {
                func(b, dir);
            }
        }
    } else {
        if (dir === 'L') {
            for (let d = num - 1; d >= 0; d--) {
                func(d, dir);
            }
        } else {
            for (let c = 0; c < num; c++) {
                func(c, dir);
            }
        }
    }
}

function numToIdString(num) {
    return num < 10 ? "0" + num.toString() : num.toString();
}

