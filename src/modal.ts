export function showModal(title: string, body: string) {
  const modalId = 'app-modal';
  let modal = document.getElementById(modalId);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
  <div class="modal" tabindex="-1" style="display:block; background: rgba(0,0,0,0.4);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${title}</h5>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-body"><p>${body}</p></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-close">Закрити</button>
        </div>
      </div>
    </div>
  </div>`;

  modal
    .querySelectorAll('.btn-close')
    .forEach((b) => b.addEventListener('click', () => modal!.remove()));
}
