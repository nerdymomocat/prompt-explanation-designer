export const hideVisWhenSidebarIsUpdated = () =>
{
   function addInputEventListener(sidebarId, vizId) {
  const sidebar_content = document.getElementById(sidebarId);
  sidebar_content.addEventListener('input', (event) => {
    if (event.target.matches('input, input *')) {
      const visualization = document.getElementById(vizId);
      visualization.style.display = 'none';
    }
  });
}

addInputEventListener('tb2-sidebar-content', 'tb2-visualization');
addInputEventListener('tb3-sidebar-content-1', 'tb3-visualization');
addInputEventListener('tb3-sidebar-content-2', 'tb3-visualization');
addInputEventListener('tb4-sidebar-content-1', 'tb4-visualization');
addInputEventListener('tb4-sidebar-content-2', 'tb4-visualization');
addInputEventListener('tb4-sidebar-content-3', 'tb4-visualization');
}


export const internalCompareButtonClick = () =>
  {
      const tb2compareBtnInt = document.querySelector("#tb2-compare-btn");
  tb2compareBtnInt.addEventListener("click", function() { openComparisonModal('tb2-text-input', 'tb2-sidebar') });

    const tb3compareBtnInt = document.querySelector("#tb3-compare-btn");
  tb3compareBtnInt.addEventListener("click", function() { openComparisonModal('tb3-text-input-1', 'tb3-sidebar-1') });

    const tb4compareBtnInt = document.querySelector("#tb4-compare-btn");
  tb4compareBtnInt.addEventListener("click", function() { openComparisonModal('tb4-text-input-1', 'tb4-sidebar-1') });

    function openComparisonModal(rti, rs) {
    const comparisonModal = document.querySelector("#comparisonModal");
    comparisonModal.style.display = "block";

    comparisonModal.dataset.relatedTextInput = rti;
    comparisonModal.dataset.sidebarContainerId = rs;
  };
  };

export const convertInputToSidebar=(inputString)=> {
    const parts = inputString.split('-');
  parts.splice(1, 1);


    parts[1] = 'sidebar';
  
    return parts.join('-');
}

const convertSidebarToInput=(inputString)=> {
    const parts = inputString.split('-');


    parts[1] = 'text-input';
  
    return parts.join('-');
}

export const getParentId = (elementId) => {
  const element = document.getElementById(elementId);
  if (element && element.parentElement) {
    return element.parentElement.id;
  }
  return null;
}

export const  removeAllItemsFromSidebar = (cid) => {
    const sidebar_container = document.querySelector("#" + cid);

    const deleteButtons = sidebar_container.querySelectorAll(".delete-button, .horizontal-line-delete-button");

    deleteButtons.forEach((deleteButton) => {
      deleteButton.onclick();
    });
  }

export const getCleanText = (id) => {
  const textInput = document.getElementById(id);
  const clone = textInput.cloneNode(true);

  const strikethroughSpans = clone.querySelectorAll('[class^="strikethrough-"]');
  strikethroughSpans.forEach(span => span.remove());

  const collapsedContentSpans = clone.querySelectorAll('.collapsed-content');
  collapsedContentSpans.forEach(span => {
    const originalText = span.getAttribute('data-original-text');
    span.textContent = originalText;
  });

  return clone.innerText;
}






  
