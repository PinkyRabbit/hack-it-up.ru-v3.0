const limit = parseInt(process.env.PAGE_LIMIT, 10);

// page number for ui is plus 1
const ui = num => 1 + num;

const twigsPagination = (count, page = 0, path = '/') => {
  const pagesCount = Math.ceil(count / limit);

  const pagination = [
    '<nav aria-label="Page navigation" class="text-center">',
    '<ul class="pagination">',
  ];

  if (pagesCount < 8) {
    for (let i = 0; i < pagesCount; i += 1) {
      const item = ui(i) === page
        ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
        : `<li><a href="${path}${i ? `?page=${ui(i)}` : ''}">${ui(i)}</a></li>`;
      pagination.push(item);
    }
  } else {
    if (page !== 1) {
      pagination.push(`<li><a href="${path}${page - 1 ? `?page=${page - 1}` : ''}" aria-label="Previous" title="Назад">`);
      pagination.push('<span aria-hidden="true">&laquo;</span>');
      pagination.push('</a></li>');
    }

    if (page < 6) {
      for (let i = 0; i < 6; i += 1) {
        const elem = ui(i) === page
          ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
          : `<li><a href="${path}${i ? `?page=${ui(i)}` : ''}">${ui(i)}</a></li>`;
        pagination.push(elem);
      }
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${pagesCount}">${pagesCount}</a></li>`);
    } else if (page > (pagesCount - 6)) {
      pagination.push(`<li><a href="${path}">1</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      for (let i = (pagesCount - 6); i < pagesCount; i += 1) {
        const elem = ui(i) === page
          ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
          : `<li><a href="${path}?page=${ui(i)}">${ui(i)}</a></li>`;
        pagination.push(elem);
      }
    } else {
      pagination.push(`<li><a href="${path}">1</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${page - 1}">${page - 1}</a></li>`);
      pagination.push(`<li class="active"><a href="${path}?page=${page}" class="prevent">${page}</a></li>`);
      pagination.push(`<li><a href="${path}?page=${page + 1}">${page + 1}</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${pagesCount}">${pagesCount}</a></li>`);
    }

    if (page !== pagesCount) {
      pagination.push(`<li><a href="${path}?page=${1 + page}" aria-label="Next" title="Вперёд">`);
      pagination.push('<span aria-hidden="true">&raquo;</span>');
      pagination.push('</a></li>');
    }
  }

  pagination.push('</ul></nav>');
  return pagination.join('');
};

module.exports = twigsPagination;
