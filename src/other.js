document.getElementById("input").addEventListener("keydown", function (e) {
    check(document.getElementById("input").value)
})
document.getElementById("input").addEventListener("change", function (e) {
    check(document.getElementById("input").value)
})

function check(val) {
    var _val = val
    var checkVal = document.getElementById("text").value.split(',')
    checkVal.forEach(ele=>{
        matchFn(val,ele).forEach(e=>{
            console.log(e.length)
            var reg = new RegExp(e[0],'g')
            _val = _val.replace(reg, '<span style="color: red">'+ e[0] + '</span>')
        })
    })
    document.getElementById("outPut").innerHTML = _val
}
var matchFn = (val,info) => {
    var reg = new RegExp(info,'g')
    // 匹配出所字段
    var matches = [...val.matchAll(reg)];
    var matchesKey = [];
    matches.forEach(item => {
        matchesKey.push(item);
    });
    return matchesKey;
};