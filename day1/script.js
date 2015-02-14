$(function(){
  var Person = function(options){
    if (!options.id) {
      options.id = new Date().getTime();
    }
    this.option = function(name, val){
      if ((typeof val != 'undefined') && (typeof name == 'string')){
        return options[name] = val;
      }
      if (typeof name == 'object'){
        return $.extend(options, name);
      }
      if (name)
        return options[name]
      return options;
    }
    console.log(options);
  };

  var Storage = function(){
    var items = {};

    getItemsAsArray = function(){
      var values = [];
      for(var key in items) {
        values.push(items[key]);
      }
      return values;
    }

    this.get = function(id){
      if (id)
        return items[id];
      return getItemsAsArray();
    }


    this.add = function(item){
      items[item.option('id')] = item;
      console.log(items);
    }

    this.delete = function(id){
      delete items[id];
    }
  }

  var storage = new Storage(),
      $form = $('#personForm'),
      $saveBtn = $('#saveBtn'),
      $cancelBtn = $('#cancelBtn'),
      $inputs = $form.find('input'),
      $list = $('#peopleList'),
      personTemplate = $('#personTemplate').html();

      onSaveBtnClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        var values = getFormValues(),
            err = validate(values);

        if (err){
          return showErrors(err);
        }
        if (values.id) {
          storage.get(values.id).option(values);
        } else {
          storage.add(new Person(values));
        }
        clearForm();
        renderTable();
        return false;
      },
      onCancelBtnClick = function(e){
        clearForm();
        return false;
      },
      onEditBtnClick = function(){
        var id = $(this).parents("[data-id]").eq(0).data('id'),
            person = storage.get(id);

            console.log(id, person, $(this).parents("[data-id]"));

        fillForm(person.option());
        return false;
      },
      onDeleteBtnClick = function(){
        var $parent = $(this).parents("[data-id]").eq(0);
        storage.delete($parent.data('id'));
        $parent.remove();
        renderTable();
        return false;
      },

      clearForm = function(){
        $inputs.val('');
      },
      fillForm = function(values){
        $inputs.val(function(){
          return values[$(this).attr('name')];
        })
      },
      getFormValues = function(){
        var values = {};
        $.each($inputs, function(index, el) {
          console.log(el);
          values[el.getAttribute('name')] = el.value;
        });
        return values;
      }
      validate = function(values){
        var errors = [];
        if (!values.name)
          errors.push('name must exists')
        if (!values.surname)
          errors.push('surname must exists')
        if (!values.age || !Number(values.age))
          errors.push('age must exists and be a number')
        return errors.length ? errors : false;
      }
      showErrors = function(errors){
        alert(errors.join('\n\r'));
      },
      renderTable = function(){
        var list = '';

        storage.get().forEach(function(person, index){
          list += renderPerson(index, person);
        })

        $list.html(list);
      },
      renderPerson = function(index, person){
        return personTemplate
                  .replace('{{index}}', index + 1)
                  .replace('{{id}}', person.option('id'))
                  .replace('{{name}}', person.option('name'))
                  .replace('{{surname}}', person.option('surname'))
                  .replace('{{age}}', person.option('age'));
      }

  $saveBtn.click(onSaveBtnClick);
  $cancelBtn.click(onCancelBtnClick);
  $list.on('click','.editBtn',onEditBtnClick)
        .on('click','.deleteBtn', onDeleteBtnClick);

});