TARGET    = mac_keychain_identity
DEBUG     = -g
CFLAGS    = -pipe -std=c99 -Wall -pedantic $(DEBUG) $(DEFINES)
SRC_FILES = $(wildcard *.c)
O_FILES   = $(SRC_FILES:%.c=%.o)
LIBS      = -framework Security -framework CoreFoundation -lcrypto


.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(O_FILES)
	gcc $(O_FILES) -o $(TARGET) $(LIBS)

clean:
	rm -f *.o $(TARGET)

run: $(TARGET)
	./$(TARGET)
