import React, { useState, FunctionComponent } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import NavBar from '../../common/components/navbar';
import { useSnackbar } from 'notistack';
import Button from '../../common/components/form_elements/button';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import { exceptionTracker } from '../../common/helpers';
import { DropzoneArea } from 'material-ui-dropzone';
import { dataupload } from '../helper/api';
import { Redirect } from 'react-router-dom';
import {
  DataGrid,
  GridColDef,
  ValueGetterParams,
  ValueFormatterParams
} from '@material-ui/data-grid';
import {excelRow} from "../helper/contracts"
interface Props {}

interface RowData {
  id: string;
  index: string|number;
  error:string;
}




const Upload: FunctionComponent<Props> = ({}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [redirectTo, setRedirectTo] = useState('');
  const [excelData, setExcelData] = useState<excelRow[]>([]);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [rows,setRows]= useState<RowData[]>([])
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false)
  const [duplicateErrorShow,setDuplicateErrorShow]= useState<boolean>(false)

  const submitForm = (bypassImage: Boolean) => {
    var formData = new FormData();
    console.log(excelFile);
    if (excelFile === undefined) {
      enqueueSnackbar('Cannot make request without excel file', {
        variant: 'error'
      });
      return;
    }
    if (!bypassImage) {
      if (imageFile === undefined) {
        enqueueSnackbar('No Image File is attached. Make request anyway?', {
          variant: 'warning',
          action: SnackbarAction
        });
        return;
      }
    }

    if (!bypassImage) {
      formData.append('files', imageFile as File);
    }
    formData.append('files', excelFile as File);
    performDataUpdate(formData);
    setSubmitDisabled(true)
    setDuplicateErrorShow(false)
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr No.', type: 'string', width: 100 },
    { field: 'index', headerName: 'Identifier Row/String', width: 410 },
    { field: 'error', headerName: 'Reason', width: 350 }]

  const performDataUpdate = async (formData: FormData) => {
    try {
      const response = await dataupload(formData);
      setSubmitDisabled(false)
      setExcelData(response);
      if(response!==undefined){
        setRows(()=>{
          return response.map((el,index)=>{
            return {
              id:(index+1).toString(),
              index:el.row,
              error:el.error
            } as RowData
          })
        })
      }
      setUploaded(true);
    } catch (err) {
      if(err.response?.data.code==177){
        setDuplicateErrorShow(true)
        setSubmitDisabled(false)
      }
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };
  const SnackbarAction = (key: number) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            submitForm(true);
            closeSnackbar(key);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          Cancel
        </Button>
      </React.Fragment>
    );
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div>
      <NavBar />
      <Box marginTop="20px">
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={11} lg={10} md={10}>
            <Grid container justify="center">
              <Grid item xs={12} sm={11} lg={5} md={5}>
                <DropzoneArea
                  filesLimit={1}
                  dropzoneParagraphClass="Please upload excel File - XLS XLSX only"
                  acceptedFiles={[
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                  ]}
                  onChange={(files: File[]) => {
                    setExcelFile(files[0]);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={11} lg={5} md={5}>
                <DropzoneArea
                  maxFileSize={10000000} // 10 MB
                  filesLimit={1}
                  dropzoneParagraphClass="Please upload Image Folder - ZIP Only"
                  onChange={(files: File[]) => {
                    setImageFile(files[0]);
                  }}
                />
              </Grid>
            </Grid>
            {duplicateErrorShow&&<p style={{color:"red"}}>Excel file with same name already uploaded</p>}
            <Grid container justify="center">
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <Button
                  color="primary"
                  onClick={() => {
                    submitForm(false);
                  }}
                  disabled={submitDisabled}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item xs={12} sm={10} md={8} lg={6}>
                <Typography variant="body1">
                  {uploaded
                    ? excelData.length === 0
                      ? ' All rows Successfully Uploaded'
                      : <DataGrid rows={rows} columns={columns} autoHeight />
                    : ''}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(Upload);
