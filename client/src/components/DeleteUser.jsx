import SoftDeleteByUser from "./deleteUsers/SoftDeleteUser";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import PermaDeleteByUser from "./deleteUsers/PermaDeleteUser";
import { MdOutlineDelete } from "react-icons/md";
import { RiUserForbidFill } from "react-icons/ri";

const DeleteUserModal = ({ setOpenDeleteModal }) => {
  const [typeOfDelete, setTypeOfDelete] = useState(true);

  const softDeleteHandler = () => {
    setTypeOfDelete(true);
  };

  const permaDeleteHandler = () => {
    setTypeOfDelete(false);
  };

  const closeModal = () => {
    setOpenDeleteModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute  top-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] md:translate-y-[40%]">
            <section className="md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-h-[350px] min-w-[350px] max-w-full md:w-fit rounded-lg">
              <section className="flex justify-between mb-2 items-center w-full">
                <span className="flex gap-4 items-center">
                  <button
                    onClick={closeModal}
                    className="w-fit h-fit rounded-full text-2xl hover:scale-105 transition-all duration-300 ease-linear hover:bg-slate-400 z-20"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="font-bold text-lg">Delete User</h1>
                </span>
              </section>
              <section className="flex justify-around items-center pb-4 border-b ">
                <button
                  onClick={softDeleteHandler}
                  className={`flex gap-2 items-center transition-all duration-300 ease-linear py-2 px-4 rounded font-bold ${
                    typeOfDelete
                      ? "bg-red-600 text-white"
                      : "bg-slate-500 hover:bg-red-600 text-white"
                  }`}
                >
                  <span className="text-xl">
                  <RiUserForbidFill />
                  </span>
                  Disable
                </button>

               
                <button
                  onClick={permaDeleteHandler}
                  className={`flex gap-2  items-center transition-all duration-300 ease-linear py-2 px-4 rounded font-bold ${
                    !typeOfDelete
                      ? "bg-red-600 text-white"
                      : "bg-slate-500 hover:bg-red-600 text-white"
                  }`}
                >
                  <span className="text-xl">
                    <MdOutlineDelete />
                  </span>
                  Delete
                </button>
              </section>
              {typeOfDelete ? <SoftDeleteByUser /> : <PermaDeleteByUser />}
            </section>
          </div>
        </section>
      </section>
    </>
  );
};

export default DeleteUserModal;
