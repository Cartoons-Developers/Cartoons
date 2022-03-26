include(admAsNeeded)
include(admPluginLocation)
SET(DM_PLUGIN_DIR "${AVIDEMUX_LIB_DIR}/${ADM_PLUGIN_DIR}/demuxers/")
MACRO(INIT_DEMUXER _lib)
ENDMACRO(INIT_DEMUXER)

MACRO(INSTALL_DEMUXER _lib)
        IF(NOT MSVC) 
                SET(EXTRALIB "m")
        ENDIF(NOT MSVC) 
        TARGET_LINK_LIBRARIES(${_lib} ADM_core6 ADM_coreUtils6 ADM_coreAudio6 ADM_coreImage6 ADM_coreUI6 ADM_core6 ADM_coreDemuxer6 ${EXTRALIB})
	INSTALL(TARGETS ${_lib} 
                DESTINATION "${DM_PLUGIN_DIR}"
                COMPONENT plugins
                )
ENDMACRO(INSTALL_DEMUXER)

MACRO(ADD_DEMUXER name)
        ADM_ADD_SHARED_LIBRARY(${name} ${ARGN})
ENDMACRO(ADD_DEMUXER name)

