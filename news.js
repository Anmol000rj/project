async function getData() {
  const response = await fetch('https://newsdata.io/api/1/news?apikey=pub_10814437b5992ca5a23ca4017c49e75903ff0&q=finance&country=in&language=en&category=business')
  const data = await response.json();
  return data;
  // .then((data) => { return data }).catch((error) => {
  // console.log('eRR', error); return 'FAIL';
  // })
}
async function main2() {
  let data = await getData()
  // console.log(data)
  if (data == 'FAIL')
    return
  data = data['results']
  let i = 0
  while (i < data.length) {
    $('#news-offcanvas').append(`
          <div class="row my-2">
            <div class="col-sm-6 m-0">
              <div class="card border-success">
                <img src=${data[i].image_url} class="card-img-top" alt="No Image">
                <div class="card-body">
                  <h6 class="card-title">${data[i].title}</h6>
                  <a href="${data[i].link}" target=”_blank” class="stretched-link"></a>
                </div>
                <p class="card-text"><small class="text-muted">
                    ${data[i].pubDate}</small>
                </p>
              </div>
            </div>
            <div class="col-sm-6 m-0">
              <div class="card border-success">
                <img src=${data[i + 1].image_url} class="card-img-top" alt="No Image">
                <div class="card-body">
                  <h6 class="card-title">${data[i + 1].title}</h6>
                  <a href="${data[i + 1].link}" target=”_blank” class="stretched-link"></a>
                </div>
                <p class="card-text"><small class="text-muted">
                    ${data[i + 1].pubDate}</small>
                </p>                
              </div>
            </div>
          </div>`);
    i += 2;
  }
  $('#newsGIF').hide()
}
let newsUpdated = false;

window.addEventListener("DOMContentLoaded", $('#newsBtn').click(() => {
  if (!newsUpdated) {
    main2()
    newsUpdated = true
  }

}))