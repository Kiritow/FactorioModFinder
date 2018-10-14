var request=require('request')
console.log('Fetching data...')

function getTimeStamp(isostr) {
    var parts = isostr.match(/\d+/g);
    return new Date(parts[0]+'-'+parts[1]+'-'+parts[2]+' '+parts[3]+':'+parts[4]+':'+parts[5]).getTime();
}

request.get('https://mods.factorio.com/api/mods?page_size=10000',
    function(err,res,data) {
        if(err) {
            console.log(err)
        }
        if(res.statusCode==200) {
            let j=JSON.parse(data)
            function showInfo(id) {
                console.log('=========================')
                console.log('Title: ' + j.results[id].title)
                console.log('PackageName: ' + j.results[id].name)
                console.log('DownloadCount: ' + j.results[id].downloads_count)
                console.log('ReleaseTime: ' + j.results[id].latest_release.released_at)
                console.log('Summary: ' + j.results[id].summary)
            }

            let arr=new Array();
            for(let i in j.results) {
                let ts=getTimeStamp(j.results[i].latest_release.released_at)
                let cnt=j.results[i].downloads_count
                if(cnt>=100) {
                    arr.push({"id":i,"update_time":ts})
                }
            }
            arr.sort(function(a,b){
                if(a.update_time<b.update_time){
                    return 1
                } else if(a.update_time>b.update_time) {
                    return -1
                } else if(a.id<b.id) {
                    return 1
                } else {
                    return -1
                }
            })
            for(let i=0;i<arr.length&&i<100;i++) {
                showInfo(arr[i].id)
            }
        }
    }
)