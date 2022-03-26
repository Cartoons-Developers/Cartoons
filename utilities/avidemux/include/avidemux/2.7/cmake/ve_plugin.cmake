#
#  Macro to declare an video encoder plugin
#
include(admPluginLocation)
SET(VE_PLUGIN_DIR "${AVIDEMUX_LIB_DIR}/${ADM_PLUGIN_DIR}/videoEncoders/")
MACRO(INIT_VIDEO_ENCODER _lib)
    ADD_DEFINITIONS("-DADM_MINIMAL_UI_INTERFACE")

ENDMACRO(INIT_VIDEO_ENCODER)

MACRO(INSTALL_VIDEO_ENCODER _lib)
	INSTALL(TARGETS ${_lib} 
                DESTINATION "${VE_PLUGIN_DIR}"
                COMPONENT plugins
                )
        IF(NOT MSVC) 
                SET(EXTRALIB "m")
        ENDIF(NOT MSVC) 
	TARGET_LINK_LIBRARIES(${_lib} ADM_core6 ADM_coreUI6 ADM_coreVideoEncoder6 ADM_coreImage6 ADM_coreUtils6 ${EXTRALIB})
ENDMACRO(INSTALL_VIDEO_ENCODER)

MACRO(ADD_VIDEO_ENCODER name)
        ADM_ADD_SHARED_LIBRARY(${name} ${ARGN})
ENDMACRO(ADD_VIDEO_ENCODER name)

