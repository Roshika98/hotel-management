const userInfoBtns = document.getElementsByClassName('userinfo');
const modalTrigger = document.getElementById('modalTrigger');
const dynamicContent = document.getElementById('dynamicContent');

console.log(userInfoBtns.length);

for (let i = 0; i < userInfoBtns.length; i++) {
    const element = userInfoBtns[i];
    element.addEventListener('click', async (event) => {
        var id = element.getAttribute('data-userInfo');
        const response = await axios.get(`${window.location.origin}/hotel/admin/receptionist/userInfo/${id}`);
        setUpDynamicContent(response.data);
    });
}


function setUpDynamicContent(data) {
    dynamicContent.innerHTML = data;
    modalTrigger.click();
}


