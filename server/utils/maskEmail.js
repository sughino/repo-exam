export function maskEmail(email) {
  const [user, domain] = email.split("@");

  if (user.length <= 3) {
    return user[0] + "*".repeat(user.length - 1) + "@" + domain;
  }

  const visible = user.slice(0, 3);
  const hidden = "*".repeat(user.length - 3);
  return visible + hidden + "@" + domain;
}