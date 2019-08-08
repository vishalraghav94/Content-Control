/*import sightengine from 'sightengine'

const sightEngine = sightengine('1137221165', 'YZmbYxZhnnLYogj5nkqJ')*/
/*let url = 'https://api.sightengine.com/1.0/check.json?api_user=1137221165&api_secret=YZmbYxZhnnLYogj5nkqJ&models=nudity&url=';
console.log('Running content script');
fetch(url).then((res) => {
    console.log('Success: ', res);
}, (err) => {
    console.log('Rejected: ', err)
}).catch(err => {
    console.error(err);
});*/
let images;
function getUrl(imgUrl) {
    let url = 'https://api.sightengine.com/1.0/check.json?api_user=1137221165&api_secret=YZmbYxZhnnLYogj5nkqJ&models=nudity&url=' + imgUrl;
    return url;
}

function getAllImagesOnPage() {
    images = document.getElementsByTagName('img');
    let imageUrls = [];
    let ext;
    let extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
    let j = 0;
    for (let i = images.length; i--;) {
        j++;
        let imageFlag = false;
        for (let j = 0; j < extensions.length; j++) {
            if (images[i].src.indexOf(extensions[j]) !== -1) {
                imageFlag = true;
                break;
            }
        }
        if (images[i].width >  100 && images[i].height > 100 && imageFlag)
            imageUrls.push(images[i].src);
        if (j > 5)
            break;
    }
    return imageUrls;
}
window.onload = function start() {
    let allImagesOnPage = getAllImagesOnPage();
    let url = 'https://api.sightengine.com/1.0/check.json?api_user=1137221165&api_secret=YZmbYxZhnnLYogj5nkqJ&models=nudity%2Cwad&url=';
    allImagesOnPage.forEach((imgUrl, index) => {
        fetch(url + imgUrl).then(res => res.json()).then(res => {
            console.log(res);
            try {
                if (res.nudity) {
                    if (res.nudity.safe < 0.50) {
                        console.log('contains nudity');
                        images[index].style.filter = 'blur(40px)';
                    }
                    else {
                        console.log('Doesnt contain nudity');
                    }
                }

                if ((typeof res.alcohol !== undefined || typeof res.alcohol != null) && (typeof res.drugs !== undefined || typeof res.drugs != null) && (typeof res.weapon !== undefined || typeof res.weapon != null)) {
                    if (res.alcohol > 0.5 || res.drugs > 0.5 || res.weapon > 0.5) {
                        console.log('Contains Drugs, Weapons or Alcohol');
                        console.log(images[index]);
                        images[index].style.filter = 'blur(40px)';
                    }
                    else{
                        console.log('Doesn\'t Contains Drugs, Weapons or Alcohol');
                    }
                }
            }
            catch (e) {
                console.error('New error', e);
            }
        }).catch(err => {
            console.error(err);
        })
    });
};

function isProblematic(imgUrl) {
    let it = getResource(imgUrl);
    //it.next();
    it.next().value.then((res) => {
        return res.json()
    }).then(res => {
        console.log(res);
        it.next(res);
    });
    //let res = it.next().value;
    //console.log('Inside is: ', res);
    //return (res.nudity.raw > 0.6 || res.nudity.partial > 0.8);
}

function *getResource(imgUrl) {
    let url = 'https://api.sightengine.com/1.0/check.json?api_user=1137221165&api_secret=YZmbYxZhnnLYogj5nkqJ&models=nudity&url=' + imgUrl;
    let res = yield fetch(url);
    console.log('outisde: ', res);
    yield res;
}
