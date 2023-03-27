function findLongestCommonSubsequence(tokens1, tokens2) {
  const lengths = Array(tokens1.length + 1)
    .fill(0)
    .map(() => Array(tokens2.length + 1).fill(0));

  for (let i = 0; i < tokens1.length; i++) {
    for (let j = 0; j < tokens2.length; j++) {
      if (tokens1[i] === tokens2[j]) {
        lengths[i + 1][j + 1] = lengths[i][j] + 1;
      } else {
        lengths[i + 1][j + 1] = Math.max(lengths[i + 1][j], lengths[i][j + 1]);
      }
    }
  }

  let result = [];
  let i = tokens1.length,
    j = tokens2.length;
  while (i > 0 && j > 0) {
    if (lengths[i][j] === lengths[i - 1][j]) {
      i--;
    } else if (lengths[i][j] === lengths[i][j - 1]) {
      j--;
    } else {
      result.unshift(tokens1[i - 1]);
      i--;
      j--;
    }
  }

  return result;
}

export function wordDiff(text1, text2) {
  const tokens1 = text1.split(/\s+/);
  const tokens2 = text2.split(/\s+/);
  const lcs = findLongestCommonSubsequence(tokens1, tokens2);

  const diffs = [];
  let i1 = 0,
    i2 = 0,
    iLcs = 0;
  let deletions = [];
  let additions = [];

  while (i1 < tokens1.length || i2 < tokens2.length) {
    let token1 = i1 < tokens1.length ? tokens1[i1] : null;
    let token2 = i2 < tokens2.length ? tokens2[i2] : null;
    let lcsToken = iLcs < lcs.length ? lcs[iLcs] : null;

    if (token1 === lcsToken && token2 === lcsToken) {
      if (deletions.length > 0) {
        diffs.push([-1, deletions.join(' ')]);
        deletions = [];
      }
      if (additions.length > 0) {
        diffs.push([1, additions.join(' ')]);
        additions = [];
      }
      diffs.push([0, token1]);
      i1++;
      i2++;
      iLcs++;
    } else {
      if (token1 !== lcsToken) {
        deletions.push(token1);
        i1++;
      }
      if (token2 !== lcsToken) {
        additions.push(token2);
        i2++;
      }
    }
  }

  if (deletions.length > 0) {
    diffs.push([-1, deletions.join(' ')]);
  }
  if (additions.length > 0) {
    diffs.push([1, additions.join(' ')]);
  }

  return diffs;
}
