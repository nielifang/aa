/**
 * Created by asus on 2019/7/23.
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
        canMove = true
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
        if (minLeft) left = minLeft;
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
    // 点击右键不出现菜单
//					$(window).contextMenu(function(e) {
//						e.preventDefault()
//					})


    $(window).mousemove(function (e) {
        //					e.preventDefault()
        if (canMove) {
            var left = e.pageX - offsetX;
            var top = e.pageY - offsetY;
            //						if(left < 0) left = 0
            //						else if(left > $(window).innerWidth()-$(".layer").innerWidth())
            //							left = $(window).innerWidth()-$(".layer").innerWidth()
            //
            //						if(top < 0)top = 0
            //						else if(top > $(window).innerHeight()-$(".layer").innerHeight())
            //							top = $(window).innerHeight()-$(".layer").innerHeight()
            var maxLeft = $(window).innerWidth() - $(`.title`).innerWidth();
            var maxTop = $(window).innerHeight() - $(`.layer`).innerHeight();
            var position = calPosition(left, top, maxLeft, maxTop)

            $(`.layer`).css({
                left: position.left,
                top: position.top
            })
        }

    });

    $(`.close`).click(function () {
        $(`.shadow`).remove();
    });

    $(`button[id="berth-info-submit"]`).click(function () {

        let berthLeng = $(`input[id="berthLengthVal"]`)[0].value;
        let berthDept = $(`input[id="berthDeptVal"]`)[0].value;
        console.log(berthLeng);
        drawBerth(berthLeng, berthDept);

        let data = {
            berthLeng: berthLeng,
            berthDept: berthDept
        };
        $.ajax({
            url: '/vesselStruct/berthInfo/',
            type: 'POST',
            data: JSON.stringify(data),
            success: function (res) {
                alert("保存成功");
                $(`.planBerth`).attr('disabled', false);
                $(`.actualBerth`).attr('disabled', false);
                $(`.inputBerth`).attr('disabled', true);

                // location.reload();
            },

            dataType: "json",
        });

    });

    function drawBerth(berthLeng, berthDept) {
        let rulerLeng = parseFloat(berthLeng) + 100;
        $(`.berthPosition`).append(`<div class="berthActual" style="width: ${berthLeng};height: ${berthDept}"><div class="ruler_container" style="width: ${rulerLeng}">
        <ul id = "ruler_ul" style="width: ${rulerLeng}"></ul>
    </div></div>`);
        let ruler_num = Math.ceil(berthLeng / 100);
        for (let i = 1; i < ruler_num; i++) {
            let ruler_index = i * 100;
            $(`#ruler_ul`).append(
                `<li><span><div class="line">${ruler_index}</div></span></li>`
            )
        }
        console.log("完成")
    }


};

$(function () {
    $(`#collapseVesselBerth`).click(function () {
        let berthInfoStr = `
<div class="form-row">
    <div class="form-group col-md-4" id="berthLengthInput">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">泊位长度</span>
            </div>
        <input type="number" class="form-control berthLengthIN" id="berthLengthVal" name="berthLengthVal">
        </div>
    </div>
    
    <div class="form-group col-md-4" id="berthDeptInput">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">水深</span>
            </div>
        <!--<input type="number" value="200" class="form-control" id="berthDeptVal" name="berthDeptVal">-->
        <input type="text" class="form-control berthDeptIN" id="berthDeptVal"
                           aria-describedby="inputGroupSuccess1Status" name="berthDeptVal">
        </div>
    </div>
  </div>
    <button id="berth-info-submit" class="btn btn-primary" >提交</button>`;

        open("请输入泊位信息", berthInfoStr)
    })
});

function setZoomBerth(zoom, el) {
    let transformOrigin = [0, 0];
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
function setBerth(a) {
    let zoomScale = Number(a) / 10;
    setZoomBerth(zoomScale, document.getElementsByClassName('zoomArea')[0])
}

function PlanBerth() {
    var DtPicker = `<div class="row">
    <div class='col-sm-4'>
        <div class="form-group" id="picker1">
            <label>选择靠泊时间：</label>
            <!--指定 date标记-->
            <div class='input-group date' id='datetimepicker1'>
                <input class="form-control" type="text" value="" id="starttime" readonly>	
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>
    <div class='col-sm-4'>
        <div class="form-group" id="picker2">
            <label>选择离泊时间：</label>
            <!--指定 date标记-->
            <div class='input-group date' id='datetimepicker2'>
                <input class="form-control" type="text" value="" id="expirationDate" readonly> 
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>
</div>
<button id="berth-time-submit" class="btn btn-success" >提交</button>`;

    $(function () {

        $('#starttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,//日期时间选择器打开之后首先显示的视图。 可接受的值：//0 分钟视图；1小时
            minView: 0, //日期时间选择器所能够提供的最精确的时间选择视图
            minuteStep: 1,//分钟
            formatViewType: 'time'
        }).on('hide', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var startTime = event.date;
            $("#expirationDate").datetimepicker('setStartDate', startTime);
            $("#expirationDate").val("");
        });

        $('#expirationDate').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,//日期时间选择器打开之后首先显示的视图。 可接受的值：//0 分钟视图；1小时
            minView: 0, //日期时间选择器所能够提供的最精确的时间选择视图
            minuteStep: 1,//分钟
            formatViewType: 'time'
        }).on('hide', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var endTime = event.date;
            $("#startDate").datetimepicker('setEndDate', endTime);
        });


    });
    open('请选择船舶到港-离港时间', DtPicker);
    $(`button[id="berth-time-submit"]`).click(function () {
        let startTm = $(`input[id="starttime"]`)[0].value;
        let endTm = $(`input[id="expirationDate"]`)[0].value;
        data = {
            startTm: startTm,
            endTm: endTm
        };
        $.ajax({
            url: '/vesselStruct/berthPeriod/',
            type: 'POST',
            data: JSON.stringify(data),
            success: function (res) {
                alert("保存成功");
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    var vesName = res[i].vesName;
                    var vesLeng = res[i].vesLeng;
                    var vesWidth = res[i].vesWidth;
                    var planBerthPos = res[i].planBerthPos;
                    var actualBerthPos = res[i].actualBerthPos;
                }
                drawPlanBerth(vesName, vesLeng, vesWidth, planBerthPos);

                // location.reload();
            },

            dataType: "json",
        });
    })
}
function drawPlanBerth(vesName, vesLeng, vesWidth, planBerthPos) {
    planBerthPosMar = parseInt(planBerthPos) + 30;
    let planBerStr = `<div class="planVessel" style="width:${vesLeng};height:80px;margin-left: ${planBerthPosMar}">${vesName}</div>`
    $(".planBerthArea").append(planBerStr)
}

function ActualBerth() {
    alert("实际靠泊")
}

