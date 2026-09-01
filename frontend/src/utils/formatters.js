export function attendanceTone(value) {
  const percentage = Number(value || 0);

  if (percentage >= 75) {
    return "success";
  }

  if (percentage >= 65) {
    return "warning";
  }

  return "danger";
}

export function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString();
}
