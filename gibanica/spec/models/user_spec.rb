require 'rails_helper'

RSpec.describe User, type: :model do
  it { is_expected.to be_mongoid_document }
  it { is_expected.to have_timestamps }
  it { is_expected.to have_index_for(email: 1).with_options(unique: true) }

  context 'created user' do
    it 'creates user with invalid password' do
      user = User.new(email: 'test@gmail.com', name: 'name', last_name: 'lastname')
      user.hash_password('aaAA1')
      user.save!

      # should not pass. password doesn't contain 2 digits and special char
      expect(user.email).to eq('test@gmail.com')
      expect(user.name).to eq('name')
      expect(user.last_name).to eq('lastname')
      expect(user.password).to eq(nil)
    end

    it 'creates user with valid password' do
      user = User.new(email: 'test@gmail.com', name: 'name', last_name: 'lastname')
      user.hash_password('aaAA11##')
      user.save!

      # should not pass. password doesn't contain 2 digits and special char
      expect(user.email).to eq('test@gmail.com')
      expect(user.name).to eq('name')
      expect(user.last_name).to eq('lastname')
      expect(user.password).not_to eq(nil)
    end
  end

  context 'password_valid?' do
    user = User.new(email: 'test@gmail.com', name: 'name', last_name: 'lastname')
    user.hash_password('aaAA11##')

    it 'returns true for valid password' do
      expect(user.password_valid?('aaAA11##')).to eq(true)
    end

    it 'returns false for invalid password' do
      expect(user.password_valid?('123')).to eq(false)
    end
  end

  context 'hash_password' do
    it 'should save hashed password if validation for strong password is passed' do
      user = User.new
      expect(user.hash_password('aaAA11##')). to eq(true)
      expect(user.password).not_to eq(nil)
    end

    it 'should not save password if validation for strong password didn\'t pass' do
      user = User.new
      expect(user.hash_password('123')). to eq(false)
      expect(user.password).to eq(nil)
    end
  end

  context 'strong password?' do
    it 'returns true if password passed validations' do
      expect(User.new.send(:strong_password?, '123aBc##')).to eq(true)
    end

    it 'returns false if password didn\'t pass validations' do
      expect(User.new.send(:strong_password?, 'password123')).to eq(false)
    end
  end

  context 'at_least_size_eight?' do
    it 'returns true if password has size at least 8' do
      expect(User.new.send(:size_at_least_eight?, 'password')).to eq(true)
    end

    it 'returns false if password doesn\'t have size at least 8' do
      expect(User.new.send(:size_at_least_eight?, 'pw')).to eq(false)
    end
  end

  context 'contains_backslash?' do
    it 'returns true if password contains backslash' do
      expect(User.new.send(:contains_backslash?, 'password\\')).to eq(true)
    end

    it 'returns false if password does\'t contain backslash' do
      expect(User.new.send(:contains_backslash?, 'pw')).to eq(false)
    end
  end

  context 'at_least_two_digits?' do
    it 'returns true if password has at least two digits' do
      expect(User.new.send(:at_least_two_digits?, 'adsw12')).to eq(true)
    end

    it 'returns false if password doesn\'t have two digits' do
      expect(User.new.send(:at_least_two_digits?, 'adswdwasd')).to eq(false)
    end
  end

  context 'at_least_one_uppercase?' do
    it 'returns true if password has at least one uppercase' do
      expect(User.new.send(:at_least_one_uppercase?, 'adADsw12')).to eq(true)
    end

    it 'returns false if password doesn\'t have an uppercase' do
      expect(User.new.send(:at_least_one_uppercase?, 'adswdwasd')).to eq(false)
    end
  end

  context 'at_least_one_downcase?' do
    it 'returns true if password has at least one lowercase' do
      expect(User.new.send(:at_least_one_downcase?, 'adADsw12')).to eq(true)
    end

    it 'returns false if password doesn\'t have a lowercase' do
      expect(User.new.send(:at_least_one_downcase?, 'WADWADW')).to eq(false)
    end
  end

  context 'at_least_one_symbol?' do
    it 'returns true if password has at least one special character' do
      expect(User.new.send(:at_least_one_symbol?, 'adADsw12%')).to eq(true)
    end

    it 'returns false if password doesn\'t have a special character' do
      expect(User.new.send(:at_least_one_symbol?, 'WADWADW')).to eq(false)
    end
  end
end
