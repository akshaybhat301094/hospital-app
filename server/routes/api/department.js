const express = require("express");
const router = express.Router();
const fs = require("fs");

/**
 * HTTP - GET method
 */
router.get("/", (req, res) => {
  const departmentList = getDepartmentList();
  res.send(departmentList);
});

/**
 * HTTP - PATCH method
 */
router.patch("/:departmentname", (req, res) => {
  const departmentName = req.params.departmentname;
  const data = req.body;
  if (
    !data.departmentname ||
    !data.contactnumber ||
    !data.head ||
    !data.hospitalname
  ) {
    return res
      .status(401)
      .send({ error: true, msg: "Department data missing" });
  }
  const existingList = getDepartmentList();
  const findDepartment = existingList.find(
    (department) =>
      department.departmentname === departmentName &&
      department.hospitalname === data.hospitalname
  );
  console.log(findDepartment);
  if (!findDepartment) {
    return res
      .status(409)
      .send({ error: true, msg: "Department does not exist" });
  }
  const filteredList = existingList.filter(
    (department) => department.departmentname !== departmentName
  );
  filteredList.push(data);
  saveDepartmentData(filteredList);
  res.send({ success: true, msg: "Department updated successfully" });
});

/**
 * HTTP - POST method
 */
router.post("/", (req, res) => {
  const existingList = getDepartmentList();
  const reqData = req.body;
  if (
    !reqData.contactnumber ||
    !reqData.departmentname ||
    !reqData.head ||
    !reqData.hospitalname
  ) {
    return res
      .status(401)
      .send({ error: true, msg: "Department data missing" });
  }

  const departmentExists = existingList.find(
    (department) =>
      department.departmentname === reqData.departmentname &&
      department.hospitalname === reqData.hospitalname
  );
  if (departmentExists) {
    return res
      .status(409)
      .send({ error: true, msg: "Department already exists" });
  }
  existingList.push(reqData);
  saveDepartmentData(existingList);
  res.send({ success: true, msg: "Department added successfully" });
  res.send("this is a post request");
});

/**
 * HTTP - DELETE api call
 */
router.delete("/:departmentname", (req, res) => {
  const departmentName = req.params.departmentname;
  const existingDepartments = getDepartmentList();
  const body = req.body;
  const filterData = existingDepartments.filter(
    (department) =>
      department.departmentname !== departmentName &&
      department.hospitalname !== body.hospitalname
  );
  if (!body.hospitalname) {
    return res
      .status(401)
      .send({ error: true, msg: "Hospital name missing in request body" });
  }
  if (existingDepartments.length == filterData.length) {
    return res
      .status(409)
      .send({ error: true, msg: "Department does not exist" });
  }
  saveDepartmentData(filterData);

  res.send({ success: true, msg: "Department removed successfully" });
});

/**
 * function used to update the data in json db
 * @param {departmentdata} data
 */
const saveDepartmentData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("json/departments.json", stringifyData);
};

/**
 * funtion to fetch all the data using filesystem
 */
const getDepartmentList = () => {
  const jsonData = fs.readFileSync("json/departments.json");
  return JSON.parse(jsonData);
};

module.exports = router;
