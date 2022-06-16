const toggleVisiblity = (target, hiddenClass) => {
    const element = document.querySelector(target).classList;
    element.toggle(hiddenClass);
};

export default toggleVisiblity;
