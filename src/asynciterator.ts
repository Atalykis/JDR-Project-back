async function* pair() {
  let i = 0;
  while (true) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    yield i;
    i = i + 2;
  }
}

async function* impair() {
  let i = 1;
  while (true) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    yield i;
    i = i + 2;
  }
}


