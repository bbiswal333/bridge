#include <Security/Security.h>
#include <openssl/x509.h>
#include <stdio.h>

static OSStatus addIdentities(SecKeychainRef kcRef, CFMutableArrayRef outArray, unsigned *numItems)
{
  //search all identities in default keychain
  SecIdentitySearchRef srchRef;
  OSStatus ortn = SecIdentitySearchCreate(kcRef, 0, &srchRef);

  do 
  {
    SecIdentityRef identity;
    ortn = SecIdentitySearchCopyNext(srchRef, &identity);

    if(ortn) 
    {          
      if(ortn == errSecItemNotFound) 
      {
        //end of search reached
        ortn = noErr;
        break;
      }
      else 
      {
        ortn = noErr;
      }      
    }

    //get certificate as DER
    SecCertificateRef certificate;
    ortn = SecIdentityCopyCertificate(identity, &certificate);    
    CFDataRef der = SecCertificateCopyData(certificate);
    const unsigned char *ptr = CFDataGetBytePtr(der);
    int len = CFDataGetLength(der);

    //get common name from issuer and filter for SSO_CA    
    X509* certificateX509 = d2i_X509(NULL, &ptr, len);
    X509_NAME *issuerX509Name = X509_get_issuer_name(certificateX509);

    int index = X509_NAME_get_index_by_NID(issuerX509Name, NID_commonName, -1);
    if (index != -1) {

        X509_NAME_ENTRY *issuerNameEntry = X509_NAME_get_entry(issuerX509Name, index);

            if (issuerNameEntry) {
                ASN1_STRING *issuerNameASN1 = X509_NAME_ENTRY_get_data(issuerNameEntry);

                if (issuerNameASN1 != NULL) {
                    unsigned char *issuerName = ASN1_STRING_data(issuerNameASN1);
                    printf("id with issuer: %s\n", issuerName);

                    if(strcmp(issuerName, "SSO_CA") == 0)
                    {
                        CFArrayAppendValue(outArray, identity);
                        (*numItems)++;                        
                    }                 
                }
            }
    }

    CFRelease(certificate);
    CFRelease(identity);    
  }
  while(ortn == noErr);
  
  CFRelease(srchRef);
  return ortn;
}

int writeFile(const char *fileName, const unsigned char *bytes, unsigned numBytes)
{
  int rtn;
  int fd;
  
  fd = open(fileName, O_RDWR | O_CREAT | O_TRUNC, 0600);
  if(fd < 0) {
    printf("file open failed\n");
    return errno;
  }
  rtn = lseek(fd, 0, SEEK_SET);
  if(rtn < 0) {
    return errno;
  }
  rtn = write(fd, bytes, (size_t)numBytes);
  if(rtn != (int)numBytes) {
    if(rtn >= 0) {
      printf("writeFile: short write\n");
    }
    rtn = EIO;
  }
  else {
    rtn = 0;
  }
  close(fd);
  return rtn;
}


int main(int p_argc, char **p_argv)
{

  int ch = 0;
  char *passphrase = NULL;
  char *fileName = NULL;

  while ((ch = getopt(p_argc, p_argv, "o:P:")) != -1)
  {
    switch  (ch)
    {    
    case 'o':
      fileName = optarg;
      break;    
    case 'P':
      passphrase = optarg;
      break;
    }
  }
  printf("fileName: %s \n", fileName);
  printf("passphrase: %s \n", passphrase);


  //get identities with issuer = SSO_CA
  OSStatus ortn;
  CFMutableArrayRef exportItems = CFArrayCreateMutable(NULL, 0, &kCFTypeArrayCallBacks);
  unsigned numItems = 0;
  ortn = addIdentities(NULL, exportItems, &numItems);
  printf("SSO_CA ids found: %d \n", numItems);


  uint32 expFlags = 0;  
  SecKeyImportExportParameters keyParams;  
  char *outFile = NULL;
  CFDataRef outData = NULL;
  unsigned len;    

  CFStringRef passStr = NULL;
  memset(&keyParams, 0, sizeof(keyParams));
  keyParams.version = SEC_KEY_IMPORT_EXPORT_PARAMS_VERSION;
  if(passphrase != NULL) {
    passStr = CFStringCreateWithCString(NULL, passphrase, kCFStringEncodingASCII);
    keyParams.passphrase = passStr;
  }
  else {
    keyParams.flags = kSecKeySecurePassphrase;
  }

  ortn = SecKeychainItemExport(exportItems, kSecFormatPKCS12, expFlags, &keyParams, &outData);
  if(ortn) 
  {
    printf("%s\n", "Error during Export");

  }
  printf("%s\n", "Data Exported");

   
  len = CFDataGetLength(outData);
  printf("file length: %d \n", len);
  if(fileName) {
    int rtn = writeFile(fileName, CFDataGetBytePtr(outData), len);
    if(rtn == 0) 
    {      
        printf("%s\n", "File written");
    }
    else {
        printf("%s\n", "Error writing file");
        printf("error number: %d \n", rtn);
    }
  }


}
