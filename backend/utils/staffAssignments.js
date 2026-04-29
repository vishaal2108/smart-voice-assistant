const STAFF_DISPLAY_ORDER = [
  "dr.v.padmavathi",
  "dr.k.aruna",
  "dr.k.manikandan",
  "mrs.d.mahalakshmi",
  "mrs.v.ezhilarasi",
  "mr.n.p.k.ganesh kumar",
  "mrs.s.gayathri",
  "mrs.s.jeevitha",
  "mrs.m.priyadarshini",
  "mr.m.a.mohamed assam",
  "mrs.n.shuruthi",
  "ms.b. bhakyalakshmi",
  "mrs.g.renuga",
  "mrs.s.sangeetha",
  "mrs.s.saranya",
  "mrs.p.anitha",
  "ms.m.sushma sri",
  "mr. m. vijay",
  "mr.n.bharanitharan",
  "mrs.r.chitra",
];

const REMOVED_STAFF_NAMES = ["ms.r.valampuranayaki"];

const normalizeStaffName = (value) => String(value || "").trim().toLowerCase();

const isRemovedStaff = (staffName) => REMOVED_STAFF_NAMES.includes(normalizeStaffName(staffName));

const sortStaffAssignments = (assignments = []) =>
  [...assignments].sort((a, b) => {
    const aName = normalizeStaffName(a.staffName);
    const bName = normalizeStaffName(b.staffName);
    const aIndex = STAFF_DISPLAY_ORDER.indexOf(aName);
    const bIndex = STAFF_DISPLAY_ORDER.indexOf(bName);
    const safeAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const safeBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

    if (safeAIndex !== safeBIndex) {
      return safeAIndex - safeBIndex;
    }

    if (aName !== bName) {
      return aName.localeCompare(bName);
    }

    return String(a.subject || "").localeCompare(String(b.subject || ""));
  });

const normalizeStaffAssignments = (assignments = []) =>
  sortStaffAssignments(assignments.filter((item) => !isRemovedStaff(item.staffName)));

module.exports = {
  STAFF_DISPLAY_ORDER,
  REMOVED_STAFF_NAMES,
  isRemovedStaff,
  normalizeStaffAssignments,
};
