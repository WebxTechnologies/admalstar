// Product toggle: Automotive Oils vs Spare Parts
document.addEventListener('DOMContentLoaded', () => {
    const btnOils = document.getElementById('btnOils');
    const btnParts = document.getElementById('btnParts');
    const oilsSection = document.getElementById('oilsSection');
    const sparePartsSection = document.getElementById('sparePartsSection');

    btnOils.addEventListener('click', () => {
        oilsSection.style.display = 'block';
        sparePartsSection.style.display = 'none';
        btnOils.classList.add('active');
        btnParts.classList.remove('active');
    });

    btnParts.addEventListener('click', () => {
        sparePartsSection.style.display = 'block';
        oilsSection.style.display = 'none';
        btnParts.classList.add('active');
        btnOils.classList.remove('active');
    });

    // Set initial view
    oilsSection.style.display = 'block';
    sparePartsSection.style.display = 'none';
});


